const { getUrl, readJsonBody, sendJson, allowCors } = require("./_lib/http");
const { getJson, setJson, hasUpstashEnv } = require("./_lib/upstash");
const { buildDealsSnapshot } = require("./_lib/mock");
const { buildSeedSnapshot } = require("./_lib/seed-deals");

function parseIntParam(v, fallback) {
  const n = Number.parseInt(String(v || ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

const moodToTags = {
  想躺平: ["海边", "度假", "休闲", "轻松", "文艺"],
  去撒野: ["自然", "夜景", "潮流", "城市"],
  吃美食: ["美食"],
  看历史: ["历史", "人文"],
};

function unique(arr) {
  return Array.from(new Set(arr));
}

function toPitfalls(f) {
  const p = [];
  if (f.isRedEye) p.push("红眼航班");
  if (!f.hasLuggage) p.push("无免费行李");
  if (!f.isRefundable) p.push("退改限制");
  if (f.transferNum > 1) p.push("中转段数偏多");
  return p.length ? p : ["综合风险可控"];
}

function tagMatchScore(f, tags) {
  const flightTags = Array.isArray(f.sceneTags) ? f.sceneTags : [];
  const match = flightTags.filter((t) => tags.includes(t)).length;
  return match * 2;
}

function budgetScore(f, budget) {
  if (!budget || !Number.isFinite(budget)) return 0;
  if (f.price > budget) return -3;
  const ratio = (budget - f.price) / Math.max(1, budget);
  return Math.min(3, Math.max(0, ratio * 6));
}

function buildReason(f, mood, budget) {
  const parts = [];
  if (budget && f.price <= budget) parts.push(`价格在预算内（¥${f.price}）`);
  if (f.discountRate >= 0.35) parts.push("折扣力度不错");
  if (Array.isArray(f.sceneTags) && f.sceneTags.length) {
    const tags = moodToTags[mood] || [];
    const matched = f.sceneTags.filter((t) => tags.includes(t));
    if (matched.length) parts.push(`符合偏好：${unique(matched).join("、")}`);
  }
  if (f.ratingScore >= 4) parts.push("综合避坑评分较高");
  return parts.join("，") || "综合性价比不错";
}

module.exports = async (req, res) => {
  if (allowCors(req, res)) return;
  if ((req.method || "GET").toUpperCase() !== "POST") {
    return sendJson(res, 405, { error: "Method Not Allowed" });
  }

  const url = getUrl(req);
  const body = (await readJsonBody(req)) || {};

  const from = String(body.from || url.searchParams.get("from") || "上海").trim();
  const windowDays = parseIntParam(
    body.windowDays || url.searchParams.get("windowDays"),
    30
  );
  const limit = parseIntParam(body.limit || url.searchParams.get("limit"), 10);
  const budget = Number(body.budget);
  const mood = String(body.mood || "").trim() || "想躺平";
  const cacheSeconds = parseIntParam(body.cacheSeconds, 900);

  const key = `ai:recommend:${from}:w${windowDays}:m${mood}:b${
    Number.isFinite(budget) ? budget : "na"
  }:l${limit}`;

  if (hasUpstashEnv()) {
    const cached = await getJson(key);
    if (cached && cached.recommendations) {
      return sendJson(res, 200, { source: "cache", ...cached });
    }
  }

  const dealsKey = `deals:${from}:w${windowDays}:l20`;
  let snapshot = hasUpstashEnv() ? await getJson(dealsKey) : null;
  if (!snapshot || !snapshot.deals) {
    const useSeed = process.env.USE_SEED_DEALS === "1";
    snapshot = useSeed
      ? buildSeedSnapshot({ from, windowDays, limit: 20 })
      : buildDealsSnapshot({
          from,
          windowDays,
          limit: 20,
          seed: `${from}:${windowDays}:20`,
        });
  }

  const tags = moodToTags[mood] || [];
  const deals = Array.isArray(snapshot.deals) ? snapshot.deals : [];

  const ranked = deals
    .map((f) => {
      const score =
        budgetScore(f, budget) +
        tagMatchScore(f, tags) +
        (f.ratingScore || 0) * 0.5 +
        (f.discountRate || 0) * 3 -
        (f.isRedEye ? 1.5 : 0) -
        (f.transferNum > 1 ? 0.8 : 0);
      return { f, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(3, limit));

  const recommendations = ranked.map(({ f }) => ({
    to: f.to,
    price: f.price,
    date: f.date,
    airline: f.airline,
    flightNo: f.flightNo,
    reason: buildReason(f, mood, Number.isFinite(budget) ? budget : null),
    pitfalls: toPitfalls(f),
    badges: f.badges || [],
    ratingScore: f.ratingScore || 0,
  }));

  const narrative = `我按“${mood}”的偏好${
    Number.isFinite(budget) ? `和预算¥${budget}` : ""
  }，从你出发地「${from}」未来${windowDays}天的低价候选里，挑了更划算且踩坑更少的目的地：`;

  const result = {
    from,
    windowDays,
    mood,
    budget: Number.isFinite(budget) ? budget : null,
    generatedAt: new Date().toISOString(),
    narrative,
    recommendations,
  };

  if (hasUpstashEnv()) {
    await setJson(key, result, cacheSeconds).catch(() => null);
  }

  return sendJson(res, 200, { source: hasUpstashEnv() ? "fresh" : "mock", ...result });
};
