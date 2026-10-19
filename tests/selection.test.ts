import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture, googleFixture, ctx } from "./helpers";
import {
  choose,
  eligible,
  pageLimit,
  pageExcluded,
  siteFor,
} from "../src/core/selection";
import type { Candidate } from "../src/core/types";
const candidates = [50, 30, 20].map(
  (weight, i) =>
    ({
      id: String(i),
      kind: "house",
      width: 320,
      height: 50,
      weight,
    }) as Candidate,
);
function rng() {
  let seed = 1234567;
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
for (const mode of ["equal", "weighted"] as const)
  test(`${mode} rotation has statistically reasonable distribution`, () => {
    const random = rng(),
      counts = [0, 0, 0],
      n = 100000;
    for (let i = 0; i < n; i++)
      counts[Number(choose(candidates, mode, new Set(), random)!.id)]!++;
    const expected = mode === "equal" ? [1 / 3, 1 / 3, 1 / 3] : [0.5, 0.3, 0.2];
    let chi = 0;
    counts.forEach((v, i) => {
      const e = n * expected[i]!;
      chi += (v - e) ** 2 / e;
      assert.ok(Math.abs(v / n - expected[i]!) < 0.006, JSON.stringify(counts));
    });
    assert.ok(chi < 20, `chi-square ${chi}`);
  });
test("remaining weights automatically normalise", () => {
  assert.equal(
    choose(candidates.slice(1), "weighted", new Set(), () => 0.59)?.id,
    "1",
  );
  assert.equal(
    choose(candidates.slice(1), "weighted", new Set(), () => 0.61)?.id,
    "2",
  );
});
test("page memory avoids duplicate campaign where alternatives exist", () => {
  assert.notEqual(
    choose(candidates, "weighted", new Set(["0"]), () => 0)?.id,
    "0",
  );
  assert.equal(
    choose([candidates[0]!], "weighted", new Set(["0"]), () => 0)?.id,
    "0",
  );
});
test("empty, zero-weight and invalid RNG all fail safely", () => {
  assert.equal(choose([], "equal"), undefined);
  assert.equal(choose([{ ...candidates[0]!, weight: 0 }], "equal"), undefined);
  for (const n of [NaN, -1, 1, Infinity])
    assert.equal(
      choose(candidates, "equal", new Set(), () => n),
      undefined,
    );
});
test("three active campaigns eligible; disabled blog excluded", () => {
  const c = fixture();
  assert.equal(eligible(c, c.sites[1]!, ctx).length, 3);
});
for (const [name, change] of Object.entries<
  (c: ReturnType<typeof fixture>) => void
>({
  "global kill switch": (c) => {
    c.global.killSwitch = true;
  },
  "global disabled": (c) => {
    c.global.enabled = false;
  },
  "site disabled": (c) => {
    c.sites[1]!.enabled = false;
  },
  "house disabled": (c) => {
    c.global.houseEnabled = false;
  },
  "placement disabled": (c) => {
    c.sites[1]!.placements["content-bottom"]!.enabled = false;
  },
  "no reviewed house": (c) => {
    c.sites[1]!.houseAdsApproved = false;
  },
  "site categories denied": (c) => {
    c.sites[1]!.categories = ["other"];
  },
  "page excluded": (c) => {
    c.sites[1]!.exclusions = [ctx.path];
  },
  "all campaigns expired": (c) => {
    for (const a of c.campaigns) a.end = "2026-02-01T00:00:00Z";
  },
  "all campaigns future": (c) => {
    for (const a of c.campaigns) a.start = "2027-01-01T00:00:00Z";
  },
  "all screen sizes excluded": (c) => {
    for (const a of c.campaigns) a.minScreen = 2000;
  },
  "all sites excluded": (c) => {
    for (const a of c.campaigns) a.sites = ["shared-ads-demo"];
  },
  "all placements excluded": (c) => {
    for (const a of c.campaigns) a.placements = ["sidebar"];
  },
  "zero page count": (c) => {
    c.sites[1]!.maxAdsPerPage = 0;
  },
  "owner mode off": (c) => {
    c.global.mode = "off";
  },
})) {
  test(`${name} returns no candidates`, () => {
    const c = fixture();
    change(c);
    assert.equal(eligible(c, c.sites[1]!, ctx).length, 0);
  });
}
test("available width selects proper variants, narrow width leaves empty", () => {
  const c = fixture();
  for (const [w, expected] of [
    [319, 0],
    [320, 320],
    [467, 320],
    [468, 468],
    [727, 468],
    [728, 728],
  ]) {
    const a = eligible(c, c.sites[1]!, { ...ctx, width: w! });
    assert.equal(a[0]?.width || 0, expected);
  }
});
test("date start inclusive / end exclusive", () => {
  const c = fixture();
  const a = c.campaigns[0]!;
  assert.ok(
    eligible(c, c.sites[1]!, { ...ctx, now: Date.parse(a.start) }).some(
      (x) => x.id === a.id,
    ),
  );
  assert.ok(
    !eligible(c, c.sites[1]!, { ...ctx, now: Date.parse(a.end) }).some(
      (x) => x.id === a.id,
    ),
  );
});
test("Google and house ads share weighted pool only with all permissions", () => {
  const c = googleFixture(),
    s = c.sites[1]!;
  assert.equal(
    eligible(c, s, { ...ctx, googleConsent: true }).filter(
      (x) => x.kind === "google",
    ).length,
    1,
  );
  assert.equal(
    eligible(c, s, { ...ctx, googleConsent: false }).filter(
      (x) => x.kind === "google",
    ).length,
    0,
  );
  c.global.googleEnabled = false;
  assert.equal(
    eligible(c, s, { ...ctx, googleConsent: true }).filter(
      (x) => x.kind === "google",
    ).length,
    0,
  );
});
test("Google-only mode falls back to house after refusal, or empty if configured", () => {
  const c = googleFixture(),
    s = c.sites[1]!;
  c.global.mode = "google-only";
  s.mode = "google-only";
  assert.ok(eligible(c, s, ctx).every((x) => x.kind === "house"));
  assert.equal(eligible(c, s, { ...ctx, googleConsent: true }).length, 1);
  c.global.fallback = "empty";
  assert.equal(eligible(c, s, ctx).length, 0);
});
test("house-only ignores Google even when consented", () => {
  const c = googleFixture();
  c.global.mode = "house-only";
  assert.equal(
    eligible(c, c.sites[1]!, { ...ctx, googleConsent: true }).some(
      (x) => x.kind === "google",
    ),
    false,
  );
});
test("exact domain and repository path scoping", () => {
  const c = fixture();
  assert.ok(
    siteFor(
      c,
      "shared-ads-demo",
      "mightora.github.io",
      "/shared-ads/demo/index.html",
    ),
  );
  for (const [h, p] of [
    ["mightora.github.io.evil.test", "/shared-ads/"],
    ["mightora.github.io", "/shared-ads-extra/"],
    ["unapproved.test", "/"],
  ])
    assert.equal(siteFor(c, "shared-ads-demo", h!, p!), undefined);
});
test("child-directed sites never produce candidates", () => {
  const c = fixture(),
    s = c.sites[3]!;
  assert.equal(eligible(c, s, { ...ctx, hostname: s.domain }).length, 0);
});
test("second placement needs content length and path approval", () => {
  const c = fixture(),
    s = c.sites[1]!;
  assert.equal(pageLimit(c, s, "/demo/article.html", 800), 2);
  assert.equal(pageLimit(c, s, "/demo/article.html", 799), 1);
  assert.equal(pageLimit(c, s, "/other", 1000), 1);
  assert.equal(
    eligible(c, s, { ...ctx, placement: "article-middle" }).length,
    0,
  );
});
for (const path of [
  "/privacy",
  "/privacy.html",
  "/privacy-policy",
  "/a/SETTINGS.html",
  "/cookies-policy.html",
  "/consent/",
  "/%70rivacy.html",
])
  test(`built-in excluded page ${path}`, () =>
    assert.equal(pageExcluded(path), true));
