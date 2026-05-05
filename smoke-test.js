const { Readable } = require("stream");

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    end(chunk) {
      if (chunk) this.body += chunk;
      this.finished = true;
    },
  };
  return res;
}

function mockGetReq(path) {
  return {
    method: "GET",
    url: path,
    headers: { host: "localhost" },
    [Symbol.asyncIterator]: async function* () {},
  };
}

function mockPostReq(path, json) {
  const raw = JSON.stringify(json);
  const stream = Readable.from([raw]);
  stream.method = "POST";
  stream.url = path;
  stream.headers = { host: "localhost", "content-type": "application/json" };
  return stream;
}

async function run() {
  const deals = require("./api/deals");
  const search = require("./api/search");
  const ai = require("./api/ai-recommend");

  const res1 = mockRes();
  await deals(mockGetReq("/api/deals?from=%E4%B8%8A%E6%B5%B7&limit=3"), res1);
  console.log("deals", res1.statusCode, res1.body.slice(0, 120));

  const res2 = mockRes();
  await search(
    mockGetReq(
      "/api/search?from=%E4%B8%8A%E6%B5%B7&to=%E6%88%90%E9%83%BD&date=2026-05-20"
    ),
    res2
  );
  console.log("search", res2.statusCode, res2.body.slice(0, 120));

  const res3 = mockRes();
  await ai(
    mockPostReq("/api/ai-recommend", { from: "上海", mood: "吃美食", limit: 3 }),
    res3
  );
  console.log("ai", res3.statusCode, res3.body.slice(0, 160));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

