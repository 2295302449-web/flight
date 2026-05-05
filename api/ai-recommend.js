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

function stripCodeFences(text) {
  const t = String(text || "").trim();
  const fenced = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : t;
}

function safeJsonParse(text) {
  const t = stripCodeFences(text);
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

function buildGlmSystemPrompt() {
  return [
    "你是“特价机票发现与出行决策助手”。",
    "你的任务：根据用户需求，从给定的候选航班/目的地数据中挑选更合适的推荐，并给出可解释理由与避坑点。",
    "约束：只能从候选数据中选择与引用，不允许编造任何城市、航班号、价格、日期。",
    "输出：必须只输出 JSON（不要 Markdown/不要代码块/不要额外文字）。",
    "JSON Schema：",
    "{",
    '  "narrative": "一句话总述",',
    '  "recommendations": [',
    "    {",
    '      "to": "目的地城市",',
    '      "price": 价格数字,',
    '      "date": "YYYY-MM-DD",',
    '      "airline": "航司名称",',
    '      "flightNo": "航班号",',
    '      "reason": "推荐理由（自然语言）",',
    '      "pitfalls": ["避坑点1","避坑点2"]',
    "    }",
    "  ]",
    "}",
  ].join("\n");
}

function buildCandidatesForPrompt(deals) {
  return (Array.isArray(deals) ? deals : []).slice(0, 20).map((f) => ({
    to: f.to,
    price: f.price,
    date: f.date,
    time: f.time,
    airline: f.airline,
    flightNo: f.flightNo,
    isRedEye: !!f.isRedEye,
    hasLuggage: !!f.hasLuggage,
    isRefundable: !!f.isRefundable,
    transferNum: f.transferNum,
    sceneTags: Array.isArray(f.sceneTags) ? f.sceneTags : [],
    ratingScore: f.ratingScore,
    badges: Array.isArray(f.badges) ? f.badges : [],
  }));
}

async function callGlmJson({ model, apiKey, system, user }) {
  const baseUrl =
    (process.env.GLM_BASE_URL || "").trim() ||
    "https://open.bigmodel.cn/api/paas/v4/chat/completions";
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
      top_p: 0.7,
      stream: false,
    }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json) {
    const err = new Error(
      (json && (json.error?.message || json.message || json.error)) ||
        `GLM request failed (HTTP ${res.status})`
    );
    err.status = res.status;
    throw err;
  }
  const content =
    json.choices?.[0]?.message?.content ??
    json.choices?.[0]?.text ??
    json.data?.choices?.[0]?.message?.content ??
    "";
  return { content: String(content || ""), raw: json };
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
  const userPrompt = String(body.prompt || body.requirement || "").trim();

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

  const aiProvider = (process.env.AI_PROVIDER || "").trim().toLowerCase();
  const glmKey = (process.env.GLM_API_KEY || "").trim();
  const glmModel = (process.env.GLM_MODEL || "").trim();
  const aiDebug = (process.env.AI_DEBUG || "").trim() === "1";

  if (aiProvider === "glm" && glmKey && glmModel) {
    const candidates = buildCandidatesForPrompt(deals);
    const userText = [
      `用户需求：${userPrompt || "（未提供额外描述）"}`,
      `出发地：${from}`,
      `时间窗：未来${windowDays}天`,
      `偏好标签：${mood}`,
      Number.isFinite(budget) ? `预算：¥${budget}` : "预算：未提供",
      `候选数据（仅可从中选择）：${JSON.stringify(candidates)}`,
      "请输出 JSON。",
    ].join("\n");

    try {
      const { content } = await callGlmJson({
        model: glmModel,
        apiKey: glmKey,
        system: buildGlmSystemPrompt(),
        user: userText,
      });
      const parsed = safeJsonParse(content);
      if (parsed && typeof parsed === "object") {
        const narrative =
          typeof parsed.narrative === "string" ? parsed.narrative : "";
        const recs = Array.isArray(parsed.recommendations)
          ? parsed.recommendations
          : [];
        const normalized = {
          from,
          windowDays,
          mood,
          budget: Number.isFinite(budget) ? budget : null,
          generatedAt: new Date().toISOString(),
          narrative:
            narrative ||
            `我按“${mood}”的偏好${
              Number.isFinite(budget) ? `和预算¥${budget}` : ""
            }，从你出发地「${from}」未来${windowDays}天的低价候选里推荐：`,
          recommendations: recs.slice(0, Math.max(3, limit)).map((r) => ({
            to: String(r.to || "").trim(),
            price: Number(r.price),
            date: String(r.date || "").trim(),
            airline: String(r.airline || "").trim(),
            flightNo: String(r.flightNo || "").trim(),
            reason: String(r.reason || "").trim(),
            pitfalls: Array.isArray(r.pitfalls)
              ? r.pitfalls.map((x) => String(x)).slice(0, 3)
              : [],
            badges: Array.isArray(r.badges) ? r.badges.slice(0, 4) : [],
            ratingScore: Number(r.ratingScore) || 0,
          })),
          aiProvider: "glm",
          model: glmModel,
        };

        if (hasUpstashEnv()) {
          await setJson(key, normalized, cacheSeconds).catch(() => null);
        }

        return sendJson(res, 200, {
          source: "glm",
          ...(aiDebug ? { debugPreview: stripCodeFences(content).slice(0, 600) } : null),
          ...normalized,
        });
      }
    } catch (e) {
      // fall through to rule-based recommendations
    }
  }

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
    aiProvider: "rules",
  };

  if (hasUpstashEnv()) {
    await setJson(key, result, cacheSeconds).catch(() => null);
  }

  return sendJson(res, 200, {
    source: hasUpstashEnv() ? "fresh" : "mock",
    ...result,
  });
};
