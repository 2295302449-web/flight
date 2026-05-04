const { getUrl, sendJson, allowCors } = require("./_lib/http");
const { getJson, setJson, hasUpstashEnv } = require("./_lib/upstash");
const { buildDealsSnapshot } = require("./_lib/mock");

function parseIntParam(v, fallback) {
  const n = Number.parseInt(String(v || ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

module.exports = async (req, res) => {
  if (allowCors(req, res)) return;
  if ((req.method || "GET").toUpperCase() !== "GET") {
    return sendJson(res, 405, { error: "Method Not Allowed" });
  }

  const url = getUrl(req);
  const from = (url.searchParams.get("from") || "上海").trim();
  const windowDays = parseIntParam(url.searchParams.get("windowDays"), 30);
  const limit = parseIntParam(url.searchParams.get("limit"), 20);
  const refresh = url.searchParams.get("refresh") === "1";
  const cacheSeconds = parseIntParam(url.searchParams.get("cacheSeconds"), 1800);

  const key = `deals:${from}:w${windowDays}:l${limit}`;

  if (!refresh && hasUpstashEnv()) {
    const cached = await getJson(key);
    if (cached && cached.deals) {
      return sendJson(res, 200, { source: "cache", ...cached });
    }
  }

  const snapshot = buildDealsSnapshot({
    from,
    windowDays,
    limit,
    seed: `${from}:${windowDays}:${limit}`,
  });

  if (hasUpstashEnv()) {
    await setJson(key, snapshot, cacheSeconds).catch(() => null);
  }

  return sendJson(res, 200, {
    source: hasUpstashEnv() ? "fresh" : "mock",
    ...snapshot,
  });
};

