import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture, googleFixture } from "./helpers";
import {
  validateConfig,
  httpsURL,
  isChildDomain,
  pathRule,
} from "../src/core/validation";
test("published schema and semantic validation accept fixture and configured Google mocks", () => {
  assert.equal(validateConfig(fixture()).ok, true);
  assert.equal(validateConfig(googleFixture()).ok, true);
});
for (const [name, change] of Object.entries<
  (c: ReturnType<typeof fixture>) => void
>({
  "unknown fields": (c) => {
    (c.global as unknown as Record<string, unknown>).track = true;
  },
  "schema version": (c) => {
    (c as unknown as { schemaVersion: number }).schemaVersion = 2;
  },
  "duplicate campaign ID": (c) => {
    c.campaigns[1]!.id = c.campaigns[0]!.id;
  },
  "wildcard domain": (c) => {
    c.sites[1]!.domain = "*.mightora.io";
  },
  "lookalike image origin": (c) => {
    c.campaigns[0]!.variants[0]!.src =
      "https://mightora.github.io.evil.test/shared-ads/adverts/a.svg";
  },
  "destination script": (c) => {
    c.campaigns[0]!.destination = "javascript:alert(1)";
  },
  "unsafe SVG URL": (c) => {
    c.campaigns[0]!.variants[0]!.src = "data:image/svg+xml,<svg/>";
  },
  "image dimensions": (c) => {
    c.campaigns[0]!.variants[0]!.width = 321;
  },
  "negative weight": (c) => {
    c.campaigns[0]!.weight = -1;
  },
  "excessive max ads": (c) => {
    c.global.maxAdsPerPage = 3;
  },
  "missing alt": (c) => {
    c.campaigns[0]!.alt = "";
  },
  "invalid UTC date": (c) => {
    c.campaigns[0]!.start = "2026-02-30T00:00:00Z";
  },
  "reversed campaign dates": (c) => {
    c.campaigns[0]!.start = c.campaigns[0]!.end;
  },
  "query tracking": (c) => {
    c.campaigns[0]!.destination = "https://mightora.io/?visitor=123";
  },
  "click redirect path": (c) => {
    c.campaigns[0]!.destination = "https://mightora.io/click/a";
  },
  "invalid path glob": (c) => {
    c.sites[1]!.exclusions = ["/**/x"];
  },
  "unregistered site reference": (c) => {
    c.campaigns[0]!.sites = ["unknown"];
  },
  "unapproved category": (c) => {
    c.campaigns[0]!.category = "unknown";
  },
  "child enabled": (c) => {
    c.sites[3]!.enabled = true;
  },
  "hero misclassified": (c) => {
    c.sites[3]!.audience = "general";
  },
  "Google incomplete setup": (c) => {
    c.sites[1]!.googleEnabled = true;
  },
  "invalid screen bounds": (c) => {
    c.campaigns[0]!.minScreen = 500;
    c.campaigns[0]!.maxScreen = 300;
  },
})) {
  test(`reject ${name}`, () => {
    const c = fixture();
    change(c);
    assert.equal(validateConfig(c).ok, false);
  });
}
for (const u of [
  "http://mightora.io/",
  "https://user:pass@mightora.io/",
  "https://mightora.io:8080/",
  "https://mightora.io/a#track",
  "https://mightora.io/%0dfoo",
  'https://mightora.io/"onload=x',
  "//mightora.io/",
  "javascript:alert(1)",
])
  test(`reject unsafe URL ${u}`, () => assert.equal(httpsURL(u), null));
test("HTTPS direct destinations and exact origins", () => {
  assert.ok(httpsURL("https://mightora.io/tools", ["https://mightora.io"]));
  assert.equal(
    httpsURL("https://mightora.io.evil.test/", ["https://mightora.io"]),
    null,
  );
});
test("hero exclusions include subdomains, typo domain and GitHub paths", () => {
  for (const [h, p] of [
    ["reading.heroacademy.app", "/"],
    ["heroacademy.app", "/"],
    ["moneyquest.heroacadmey.app", "/"],
    ["mightora.github.io", "/hero-academy-reading/"],
  ])
    assert.equal(isChildDomain(h!, p), true);
  assert.equal(isChildDomain("heroacademy.app.evil.test"), false);
});
test("path rules allow only exact or terminal prefix glob", () => {
  assert.equal(pathRule("/articles/*"), true);
  assert.equal(pathRule("/articles/**"), false);
  assert.equal(pathRule("/../settings"), false);
});
