import { test } from "node:test";
import assert from "node:assert/strict";
import { readLimited } from "../src/core/network";
test("bounded resource reader rejects oversized body even without content-length", async () => {
  await assert.rejects(
    () => readLimited(new Response("a".repeat(1025)), 1024),
    /too large/,
  );
});
test("bounded reader rejects oversized declared resources and preserves UTF-8 bytes", async () => {
  await assert.rejects(
    () =>
      readLimited(
        new Response("x", { headers: { "content-length": "9999" } }),
        100,
      ),
    /too large/,
  );
  const bytes = await readLimited(new Response("Mightora · Feedback"), 100);
  assert.equal(new TextDecoder().decode(bytes), "Mightora · Feedback");
});
