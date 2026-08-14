import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Uru's starlight room", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ko">/i);
  assert.match(html, /<title>별빛 방 — 우루와 마음껏 상상하는 공간<\/title>/i);
  assert.match(html, /안녕, 나는 우루야!/);
  assert.match(html, /우루 · ROOM GUIDE/);
  assert.match(html, /aria-label="별빛 방 전경"/);
  assert.match(html, /aria-label="달빛 편지 열기"/);
  assert.match(html, /aria-label="상상의 옷장 열기"/);
  assert.match(html, /aria-label="꿈꾸는 램프 열기"/);
  assert.match(html, /aria-label="마음의 갤러리 열기"/);
});

test("prefers lightweight room and character images", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /starlight-room\.avif/);
  assert.match(html, /starlight-room\.webp/);
  assert.match(html, /axolotl-guide\.avif/);
  assert.match(html, /axolotl-guide\.webp/);
  assert.match(html, /fetchPriority="high"/);
});
