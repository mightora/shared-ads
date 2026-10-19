import { test } from "node:test";
import assert from "node:assert/strict";
import { checkAdsTxt, validAdsTxt } from "../scripts/ads-txt";
import { fixture, googleFixture } from "./helpers";
test("ads.txt authorisation checks exact publisher and DIRECT relationship", () => {
  assert.equal(
    validAdsTxt(
      "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0 # owner",
      "ca-pub-1234567890123456",
    ),
    true,
  );
  for (const text of [
    "google.com, pub-1111111111111111, DIRECT, f08c47fec0942fa0",
    "google.com, pub-1234567890123456, RESELLER, f08c47fec0942fa0",
    "google.com.evil, pub-1234567890123456, DIRECT, f08c47fec0942fa0",
  ])
    assert.equal(validAdsTxt(text, "ca-pub-1234567890123456"), false);
});
test("house-only config causes no ads.txt fetch", async () => {
  const errors = await checkAdsTxt(fixture(), async () => {
    throw Error("No request expected");
  });
  assert.deepEqual(errors, []);
});
test("enabled domains require root ads.txt using mocks", async () => {
  const c = googleFixture();
  let url = "";
  const result = await checkAdsTxt(c, async (request) => {
    url = String(request);
    return new Response(
      "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0",
    );
  });
  assert.equal(url, "https://127.0.0.1/ads.txt");
  assert.deepEqual(result, []);
  const errors = await checkAdsTxt(
    c,
    async () => new Response("missing", { status: 404 }),
  );
  assert.equal(errors.length, 1);
});
