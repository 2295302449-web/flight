const seed = require("../_data/deals_seed.json");

function normalizeFrom(from) {
  const s = String(from || "").trim();
  return s || "上海";
}

function getSeedDeals(from) {
  const key = normalizeFrom(from);
  if (seed && Array.isArray(seed[key]) && seed[key].length) return seed[key];
  const firstKey = seed ? Object.keys(seed)[0] : null;
  if (firstKey && Array.isArray(seed[firstKey])) return seed[firstKey];
  return [];
}

function buildSeedSnapshot({ from, windowDays, limit }) {
  const f = normalizeFrom(from);
  const deals = getSeedDeals(f)
    .slice()
    .sort((a, b) => (a.price || 0) - (b.price || 0))
    .slice(0, Math.max(1, limit || 20));
  return {
    from: f,
    windowDays: windowDays || 30,
    generatedAt: new Date().toISOString(),
    currency: "CNY",
    deals,
  };
}

module.exports = { buildSeedSnapshot };

