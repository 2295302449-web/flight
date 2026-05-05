const { sendJson } = require("./http");

function hasUpstashEnv() {
  return (
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function upstashFetch(path, init) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init && init.headers ? init.headers : {}),
    },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(
      (json && json.error) || `Upstash error (HTTP ${res.status})`
    );
    err.status = res.status;
    throw err;
  }
  return json;
}

async function getJson(key) {
  if (!hasUpstashEnv()) return null;
  const json = await upstashFetch(`/get/${encodeURIComponent(key)}`, {
    method: "GET",
  });
  if (!json || json.result == null) return null;
  try {
    return JSON.parse(json.result);
  } catch {
    return null;
  }
}

async function setJson(key, value, exSeconds) {
  if (!hasUpstashEnv()) return null;
  const qs = exSeconds ? `?EX=${encodeURIComponent(String(exSeconds))}` : "";
  const res = await upstashFetch(`/set/${encodeURIComponent(key)}${qs}`, {
    method: "POST",
    body: JSON.stringify(value),
  });
  return res && res.result;
}

function requireUpstashOrOk(res) {
  if (hasUpstashEnv()) return true;
  sendJson(res, 200, {
    ok: true,
    storage: "memory",
    hint:
      "未配置 UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN，当前仅使用占位数据与无持久化缓存。",
  });
  return false;
}

module.exports = { hasUpstashEnv, getJson, setJson, requireUpstashOrOk };

