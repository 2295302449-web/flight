function hashToUnit(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

const baseRoutes = [
  { from: "上海", to: "成都", airline: "东方航空", flightNo: "MU9012" },
  { from: "上海", to: "北京", airline: "春秋航空", flightNo: "9C1234" },
  { from: "上海", to: "广州", airline: "春秋航空", flightNo: "9C5678" },
  { from: "北京", to: "上海", airline: "中国国航", flightNo: "CA1234" },
  { from: "北京", to: "广州", airline: "南方航空", flightNo: "CZ5678" },
  { from: "北京", to: "深圳", airline: "中国国航", flightNo: "CA5678" },
  { from: "广州", to: "北京", airline: "深圳航空", flightNo: "ZH3456" },
  { from: "广州", to: "上海", airline: "南方航空", flightNo: "CZ9012" },
  { from: "广州", to: "成都", airline: "中国国航", flightNo: "CA9012" },
  { from: "成都", to: "上海", airline: "海南航空", flightNo: "HU7890" },
  { from: "成都", to: "北京", airline: "东方航空", flightNo: "MU3456" },
  { from: "北京", to: "杭州", airline: "南方航空", flightNo: "CZ3456" },
  { from: "杭州", to: "北京", airline: "东方航空", flightNo: "MU7890" },
  { from: "深圳", to: "上海", airline: "深圳航空", flightNo: "ZH7890" },
];

function sceneTagsByCity(city) {
  const map = {
    三亚: ["海边", "度假"],
    厦门: ["海边", "文艺"],
    青岛: ["海边", "啤酒"],
    成都: ["美食", "休闲"],
    重庆: ["美食", "夜景"],
    西安: ["历史", "人文"],
    北京: ["历史", "城市"],
    杭州: ["自然", "城市"],
    昆明: ["自然", "轻松"],
    广州: ["美食", "城市"],
    深圳: ["城市", "潮流"],
    上海: ["城市", "文艺"],
  };
  return map[city] || ["城市"];
}

function buildBadges({ hasLuggage, isRefundable, isRedEye, discountRate }) {
  const badges = [];
  if (hasLuggage) badges.push("含托运");
  else badges.push("无行李");
  if (isRefundable) badges.push("可退改");
  if (isRedEye) badges.push("红眼");
  if (discountRate >= 0.35) badges.push("推荐");
  if (!isRefundable || !hasLuggage || isRedEye) badges.push("慎购");
  return Array.from(new Set(badges)).slice(0, 4);
}

function ratingScore({ hasLuggage, isRefundable, isRedEye, transferNum }) {
  let score = 5;
  if (isRedEye) score -= 2;
  if (!hasLuggage) score -= 1;
  if (!isRefundable) score -= 1;
  if (transferNum > 1) score -= 1;
  return clamp(score, 1, 5);
}

function aiAnalysisText(f) {
  const risks = [];
  if (f.isRedEye) risks.push("红眼航班对体力要求高");
  if (!f.hasLuggage) risks.push("无免费行李需额外预算");
  if (!f.isRefundable) risks.push("退改限制较多");
  if (f.transferNum > 1) risks.push("中转段数较多留足衔接时间");
  const positives = [];
  if (f.discountRate >= 0.35) positives.push("折扣力度不错");
  if (f.hasLuggage) positives.push("含托运行李更省心");
  if (f.isRefundable) positives.push("退改更灵活");
  const a = positives.length ? `优点：${positives.join("，")}。` : "";
  const b = risks.length ? `注意：${risks.join("，")}。` : "";
  return `${a}${b}`.trim() || "综合性价比较高，建议结合出行时间安排选择。";
}

function buildMockFlights({ from, to, date, windowDays, limit, seed }) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const routes = baseRoutes.filter((r) => {
    if (from && r.from !== from) return false;
    if (to && r.to !== to) return false;
    return true;
  });
  const list = [];
  const desired = Math.max(10, limit || 20);

  for (let i = 0; i < desired; i++) {
    const r = routes[i % routes.length] || baseRoutes[i % baseRoutes.length];
    const u = hashToUnit(`${seed || ""}:${r.from}:${r.to}:${i}`);
    const days = windowDays ? Math.floor(u * windowDays) : Math.floor(u * 30);
    const d = date ? new Date(date) : addDays(now, days);
    const timeHour = Math.floor(hashToUnit(`${seed}:t:${i}`) * 24);
    const timeMin = Math.floor(hashToUnit(`${seed}:m:${i}`) * 6) * 10;
    const time = `${pad2(timeHour)}:${pad2(timeMin)}`;

    const base = 200 + Math.floor(hashToUnit(`${seed}:p:${i}`) * 800);
    const discount = 0.15 + hashToUnit(`${seed}:d:${i}`) * 0.55;
    const price = Math.round(base * (1 - discount));
    const originalPrice = Math.round(base * (1 + 0.2 + hashToUnit(`${seed}:o:${i}`) * 0.6));
    const hasLuggage = hashToUnit(`${seed}:l:${i}`) > 0.3;
    const isRefundable = hashToUnit(`${seed}:r:${i}`) > 0.55;
    const isRedEye = timeHour <= 6 || timeHour >= 22;
    const transferNum = hashToUnit(`${seed}:x:${i}`) > 0.85 ? 2 : 1;
    const discountRate = (originalPrice - price) / originalPrice;

    const f = {
      id: Math.floor(hashToUnit(`${seed}:id:${i}`) * 1000000000),
      airline: r.airline,
      flightNo: r.flightNo,
      from: r.from,
      to: r.to,
      price,
      originalPrice,
      date: formatDate(d),
      time,
      isDirect: transferNum === 1,
      isRedEye,
      hasLuggage,
      isRefundable,
      transferNum,
      targetGroup: ["学生党", "上班族", "家庭"].filter(
        (_, idx) => hashToUnit(`${seed}:g:${i}:${idx}`) > 0.4
      ),
      ratingScore: ratingScore({ hasLuggage, isRefundable, isRedEye, transferNum }),
      badges: buildBadges({ hasLuggage, isRefundable, isRedEye, discountRate }),
      discountRate,
      sceneTags: sceneTagsByCity(r.to),
    };
    f.aiAnalysis = aiAnalysisText(f);
    list.push(f);
  }

  const filtered = list.filter((f) => {
    if (from && f.from !== from) return false;
    if (to && f.to !== to) return false;
    if (date && f.date !== date) return false;
    return true;
  });

  return filtered;
}

function buildDealsSnapshot({ from, windowDays, limit, seed }) {
  const flights = buildMockFlights({
    from,
    windowDays,
    limit: Math.max(limit || 20, 30),
    seed,
  });
  flights.sort((a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    return b.discountRate - a.discountRate;
  });
  const deals = flights.slice(0, limit || 20);

  return {
    from: from || "上海",
    windowDays: windowDays || 30,
    generatedAt: new Date().toISOString(),
    currency: "CNY",
    deals,
  };
}

module.exports = { buildDealsSnapshot, buildMockFlights };

