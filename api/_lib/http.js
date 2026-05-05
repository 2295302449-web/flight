function getUrl(req) {
  const base =
    (req.headers && req.headers.host && `http://${req.headers.host}`) ||
    "http://localhost";
  return new URL(req.url || "/", base);
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function sendJson(res, status, data, extraHeaders) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (extraHeaders && typeof extraHeaders === "object") {
    for (const [k, v] of Object.entries(extraHeaders)) res.setHeader(k, v);
  }
  res.end(JSON.stringify(data));
}

function allowCors(req, res) {
  const origin = (req.headers && req.headers.origin) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if ((req.method || "GET").toUpperCase() === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

module.exports = { getUrl, readJsonBody, sendJson, allowCors };

