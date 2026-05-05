const { getUrl, sendJson, allowCors } = require("./_lib/http");
const { buildMockFlights } = require("./_lib/mock");

function parseIntParam(v, fallback) {
  const n = Number.parseInt(String(v || ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function isIataCode(s) {
  return /^[A-Z]{3}$/.test(String(s || "").trim());
}

const cityToIata = {
  北京: "BJS",
  上海: "SHA",
  广州: "CAN",
  深圳: "SZX",
  成都: "CTU",
  杭州: "HGH",
  重庆: "CKG",
  西安: "SIA",
  昆明: "KMG",
  厦门: "XMN",
  青岛: "TAO",
  三亚: "SYX",
  南京: "NKG",
  武汉: "WUH",
  长沙: "CSX",
};

const iataToCity = Object.entries(cityToIata).reduce((acc, [city, iata]) => {
  acc[iata] = city;
  return acc;
}, {});

function normalizeToDisplayCity(input, fallback) {
  const s = String(input || "").trim();
  if (!s) return fallback;
  if (isIataCode(s) && iataToCity[s]) return iataToCity[s];
  return s;
}

function buildFromJuheFlightInfo(list, displayFrom, displayTo) {
  const seedBase = `${displayFrom}:${displayTo}`;
  return list.map((x, idx) => {
    const price = Number.isFinite(Number(x.ticketPrice))
      ? Math.round(Number(x.ticketPrice))
      : 0;
    const seed = `${seedBase}:${x.flightNo || ""}:${idx}`;
    const u =
      (seed.split("").reduce((acc, ch) => (acc * 33 + ch.charCodeAt(0)) >>> 0, 5381) %
        1000) /
      1000;
    const originalPrice = price
      ? Math.round(price * (1.15 + u * 0.55))
      : Math.round(600 + u * 800);
    const hour = parseInt(String(x.departureTime || "0").slice(0, 2), 10);
    const isRedEye = Number.isFinite(hour) ? hour <= 6 || hour >= 22 : false;
    const transferNum = Number.isFinite(Number(x.transferNum))
      ? Number(x.transferNum)
      : 1;
    const isDirect = transferNum === 1;
    const hasLuggage = u > 0.35;
    const isRefundable = u > 0.6;
    const discountRate = originalPrice ? (originalPrice - price) / originalPrice : 0;
    const badges = [];
    if (hasLuggage) badges.push("含托运");
    else badges.push("无行李");
    if (isRefundable) badges.push("可退改");
    if (isRedEye) badges.push("红眼");
    if (discountRate >= 0.35) badges.push("推荐");
    if (!isRefundable || !hasLuggage || isRedEye) badges.push("慎购");

    let score = 5;
    if (isRedEye) score -= 2;
    if (!hasLuggage) score -= 1;
    if (!isRefundable) score -= 1;
    if (transferNum > 1) score -= 1;
    score = Math.max(1, Math.min(5, score));

    const aiAnalysis = [
      discountRate >= 0.35 ? "折扣力度不错" : null,
      isDirect ? "直飞更省心" : "注意中转衔接时间",
      isRedEye ? "红眼航班注意休息" : null,
      hasLuggage ? "含托运更省预算" : "无免费行李需额外预算",
      isRefundable ? "退改更灵活" : "退改限制较多",
    ]
      .filter(Boolean)
      .join("，");

    return {
      id: Math.floor(u * 1000000000) + idx,
      airline: x.airlineName || x.airline || "未知航司",
      flightNo: String(x.flightNo || "").replace(/\s+/g, " ").trim() || "未知航班",
      from: displayFrom,
      to: displayTo,
      price: price || Math.round(300 + u * 900),
      originalPrice,
      date: x.departureDate || "",
      time: x.departureTime || "",
      isDirect,
      isRedEye,
      hasLuggage,
      isRefundable,
      transferNum,
      targetGroup: ["学生党", "上班族", "家庭"].filter((_, i) => u > 0.25 + i * 0.15),
      ratingScore: score,
      badges: Array.from(new Set(badges)).slice(0, 4),
      aiAnalysis: aiAnalysis || "综合考虑时间与预算选择更合适的航班。",
    };
  });
}

async function fetchJuheFlights({ departure, arrival, departureDate, maxSegments }) {
  const key = process.env.JUHE_FLIGHT_KEY;
  if (!key) return null;
  const qs = new URLSearchParams();
  qs.set("key", key);
  qs.set("departure", departure);
  qs.set("arrival", arrival);
  qs.set("departureDate", departureDate);
  if (maxSegments != null) qs.set("maxSegments", String(maxSegments));
  const url = `https://apis.juhe.cn/flight/query?${qs.toString()}`;
  const res = await fetch(url, { method: "GET" });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json) return null;
  if (json.error_code !== 0) return null;
  return json;
}

module.exports = async (req, res) => {
  if (allowCors(req, res)) return;
  if ((req.method || "GET").toUpperCase() !== "GET") {
    return sendJson(res, 405, { error: "Method Not Allowed" });
  }

  const url = getUrl(req);
  const fromRaw = (url.searchParams.get("from") || "").trim();
  const toRaw = (url.searchParams.get("to") || "").trim();
  const date = (url.searchParams.get("date") || "").trim();
  const days = parseIntParam(url.searchParams.get("days"), null);

  const displayFrom = normalizeToDisplayCity(fromRaw, "上海");
  const displayTo = normalizeToDisplayCity(toRaw, "北京");

  const departure = isIataCode(fromRaw) ? fromRaw : cityToIata[fromRaw];
  const arrival = isIataCode(toRaw) ? toRaw : cityToIata[toRaw];

  let flights = null;
  let source = "mock";

  if (departure && arrival && date && process.env.JUHE_FLIGHT_KEY) {
    const juhe = await fetchJuheFlights({
      departure,
      arrival,
      departureDate: date,
      maxSegments: url.searchParams.get("maxSegments") || "",
    });
    if (juhe && juhe.result && Array.isArray(juhe.result.flightInfo)) {
      flights = buildFromJuheFlightInfo(juhe.result.flightInfo, displayFrom, displayTo);
      source = "juhe";
    }
  }

  if (!flights) {
    flights = buildMockFlights({
      from: displayFrom || undefined,
      to: displayTo || undefined,
      date: date || undefined,
      windowDays: days || 30,
      limit: 30,
      seed: `${displayFrom}:${displayTo}:${date || ""}:${days || ""}`,
    });
  }

  if (days && !date) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const future = new Date(now);
    future.setDate(future.getDate() + days);
    flights = flights.filter((f) => {
      const d = new Date(f.date);
      return d >= now && d <= future;
    });
  }

  return sendJson(res, 200, {
    source,
    query: { from: displayFrom, to: displayTo, date, days },
    flights,
  });
};
