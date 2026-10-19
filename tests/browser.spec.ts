import { test, expect, type Page } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { unzipSync } from "fflate";
import AxeBuilder from "@axe-core/playwright";
import { fixture, googleFixture } from "./helpers";
import type { Config } from "../src/core/types";
const mime: Record<string, string> = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".html": "text/html",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".css": "text/css",
  ".yaml": "application/json",
};
const publishedCampaignCount = JSON.parse(
  readFileSync("config/config.json", "utf8"),
).campaigns.length;
// Intercept every request: Google is ALWAYS a mock or blocked. No live ad impression can escape.
test.beforeEach(async ({ context }) => {
  await context.route("**/*", async (route) => {
    const u = new URL(route.request().url());
    if (u.protocol === "file:") {
      await route.continue();
      return;
    }
    let file = "";
    if (u.hostname === "127.0.0.1") {
      let path = u.pathname.replace(/^\/shared-ads\//, "/");
      if (path.endsWith("/")) path += "index.html";
      file = resolve("dist", "." + path);
      if (!file.startsWith(resolve("dist") + sep)) return route.abort();
    } else if (u.hostname === "cdn.jsdelivr.net") {
      file = u.pathname.endsWith("components.js")
        ? resolve("demo/vendor/components.js")
        : u.pathname.endsWith("shared.css")
          ? resolve("demo/vendor/shared.css")
          : "";
    } else if (
      u.hostname === "raw.githubusercontent.com" &&
      u.pathname.endsWith("mightoraIoLogo4-200x900.png")
    )
      file = resolve("demo/assets/mightora-logo.png");
    else if (
      u.hostname === "mightora.github.io" &&
      u.pathname.includes("/shared-ads/adverts/")
    )
      file = resolve("public/adverts", u.pathname.split("/").at(-1)!);
    if (file && existsSync(file)) {
      await route.fulfill({
        status: 200,
        contentType: mime[extname(file)] || "application/octet-stream",
        body: readFileSync(file),
        headers: { "Access-Control-Allow-Origin": "*" },
      });
      return;
    }
    await route.abort();
  });
});
const harness =
  '<!doctype html><html lang="en"><head><title>Runtime test</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main style="max-width:780px;margin:auto"><h1>Useful content</h1><p>Content comes before advertising.</p><mightora-ad placement="content-bottom"></mightora-ad></main><script src="/v1/mightora-ads.js"></script></body></html>';
async function openHarness(page: Page, c: Config = fixture(), html = harness) {
  await page.route("**/harness.html", (r) =>
    r.fulfill({ contentType: "text/html", body: html }),
  );
  await page.route("**/config/config.json?*", (r) =>
    r.fulfill({ contentType: "application/json", body: JSON.stringify(c) }),
  );
  await page.goto("/harness.html");
  await page.waitForFunction(() => !!(window as any).MightoraAds);
}
async function start(page: Page, extras: Record<string, unknown> = {}) {
  await page.evaluate(async (extras) => {
    (window as any).withdrawals = 0;
    await (window as any).MightoraAds.start({
      enabled: true,
      siteId: "local-preview",
      allowedHosts: ["127.0.0.1"],
      configUrl: "http://127.0.0.1:4173/config/config.json",
      development: true,
      onGoogleWithdrawal: () => {
        (window as any).withdrawals++;
      },
      ...extras,
    });
  }, extras);
}
async function cmp(page: Page, consented = true) {
  await page.evaluate((consented) => {
    const w = window as any;
    w.tc = {
      cmpId: 300,
      cmpStatus: "loaded",
      eventStatus: "tcloaded",
      listenerId: 1,
      gdprApplies: true,
      tcString: "MOCK-CMP-STRING-DO-NOT-USE-IN-PRODUCTION",
      vendor: { consents: { 755: consented } },
      purpose: {
        consents: Object.fromEntries(
          [1, 2, 3, 4, 7, 9, 10].map((p) => [p, consented]),
        ),
      },
    };
    w.__tcfapi = (
      command: string,
      _version: number,
      cb: (d: unknown, ok: boolean) => void,
    ) => {
      if (command === "addEventListener") {
        w.tcfCallback = cb;
        cb(w.tc, true);
      }
    };
  }, consented);
}
async function googleMock(page: Page, unfilled = false, delay = 0) {
  await page.route("https://pagead2.googlesyndication.com/**", async (r) => {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    await r.fulfill({
      contentType: "text/javascript",
      body: `window.mockLoads=(window.mockLoads||0)+1;window.adsbygoogle={push:function(){window.mockPushes=(window.mockPushes||0)+1;var units=document.querySelectorAll('ins.adsbygoogle');units[units.length-1].dataset.adStatus='${unfilled ? "unfilled" : "filled"}';}};`,
    });
  });
}
test("shared component renders a credential-free, accessible house image and direct link", async ({
  page,
}) => {
  let credentials: string | undefined;
  page.on("request", (r) => {
    if (r.url().includes("/adverts/")) credentials = r.headers().cookie;
  });
  await openHarness(page);
  await start(page);
  const img = page.locator("mightora-ad img");
  await expect(img).toBeVisible();
  expect(credentials).toBeUndefined();
  const a = page.locator("mightora-ad a");
  await expect(a).toHaveAttribute("rel", "sponsored noopener noreferrer");
  await expect(img).toHaveAttribute("alt", /opens in a new tab/);
  await page.keyboard.press("Tab");
  await expect(a).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("no automatic insertion, no request when library is merely loaded", async ({
  page,
}) => {
  let config = 0;
  page.on("request", (r) => {
    if (r.url().includes("/config/config.json")) config++;
  });
  await openHarness(page);
  await page.waitForTimeout(150);
  expect(config).toBe(0);
  await expect(page.locator("mightora-ad")).toHaveCount(1);
  await expect(page.locator("mightora-ad img")).toHaveCount(0);
});
for (const [name, extras] of Object.entries({
  disabled: { enabled: false },
  offline: { offline: true },
  unapprovedHost: { allowedHosts: ["other.example"] },
}))
  test(`${name} makes zero advertising requests`, async ({ page }) => {
    let ads = 0;
    await openHarness(page);
    page.on("request", (r) => {
      if (/config\/config|adverts\/|googlesyndication/.test(r.url())) ads++;
    });
    await start(page, extras);
    await page.waitForTimeout(100);
    expect(ads).toBe(0);
  });
test("forbidden placement and forms cannot render", async ({ page }) => {
  await openHarness(
    page,
    fixture(),
    harness.replace(
      '<mightora-ad placement="content-bottom"></mightora-ad>',
      '<mightora-ad placement="unknown"></mightora-ad><form><mightora-ad placement="content-bottom"></mightora-ad></form>',
    ),
  );
  await start(page);
  await expect(page.locator("mightora-ad img")).toHaveCount(0);
});
test("default maximum is one advert per ordinary page", async ({ page }) => {
  await openHarness(
    page,
    fixture(),
    harness.replace(
      "</main>",
      '<mightora-ad placement="sidebar"></mightora-ad></main>',
    ),
  );
  await start(page);
  await expect(page.locator("mightora-ad img")).toHaveCount(1);
});
test("long approved page has two diverse campaigns", async ({ page }) => {
  await openHarness(
    page,
    fixture(),
    harness
      .replace(
        "<p>Content comes before advertising.</p>",
        "<p>" + "Useful architecture guidance. ".repeat(400) + "</p>",
      )
      .replace(
        "</main>",
        '<mightora-ad placement="footer-above-author"></mightora-ad></main>',
      ),
  );
  await page.evaluate(() => history.replaceState({}, "", "/demo/article.html"));
  await start(page);
  for (const ad of await page.locator("mightora-ad").all())
    await ad.scrollIntoViewIfNeeded();
  await expect(page.locator("mightora-ad img")).toHaveCount(2);
  const hrefs = await page
    .locator("mightora-ad a")
    .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
  expect(new Set(hrefs).size).toBe(2);
});
test("broken artwork fails over only to another eligible house campaign", async ({
  page,
}) => {
  await openHarness(page);
  let failed = 0;
  await page.route("**/adverts/**", async (r) => {
    if (failed++ === 0) await r.fulfill({ status: 404, body: "" });
    else {
      const name = new URL(r.request().url()).pathname.split("/").at(-1)!;
      await r.fulfill({
        contentType: "image/svg+xml",
        body: readFileSync("public/adverts/" + name),
      });
    }
  });
  await start(page);
  await expect(page.locator("mightora-ad img")).toBeVisible();
  expect(failed).toBeGreaterThan(1);
});
test("unavailable or invalid central configuration fails empty", async ({
  page,
}) => {
  await openHarness(page);
  await page.route("**/config/config.json?*", (r) =>
    r.fulfill({ status: 503, body: "unavailable" }),
  );
  await start(page);
  await expect(page.locator("mightora-ad img")).toHaveCount(0);
  await page.route("**/config/config.json?*", (r) =>
    r.fulfill({
      contentType: "application/json",
      body: '{"global":{"enabled":true}}',
    }),
  );
  await page.evaluate(() => (window as any).MightoraAds.refresh());
  await expect(page.locator("mightora-ad img")).toHaveCount(0);
});
test("global kill switch and failed revalidation clear a displayed advert", async ({
  page,
}) => {
  const c = fixture();
  await openHarness(page, c);
  await start(page);
  await expect(page.locator("mightora-ad img")).toBeVisible();
  c.global.killSwitch = true;
  await page.route("**/config/config.json?*", (r) =>
    r.fulfill({ contentType: "application/json", body: JSON.stringify(c) }),
  );
  await page.evaluate(() => (window as any).MightoraAds.refresh());
  await expect(page.locator("mightora-ad img")).toHaveCount(0);
});
test("refused or absent consent never initialises Google and serves house instead", async ({
  page,
}) => {
  await openHarness(page, googleFixture());
  let requests = 0;
  page.on("request", (r) => {
    if (r.url().includes("googlesyndication")) requests++;
  });
  await cmp(page, false);
  await start(page);
  await expect(page.locator("mightora-ad img")).toBeVisible();
  expect(requests).toBe(0);
  await expect(page.locator("ins.adsbygoogle")).toHaveCount(0);
});
test("consented manual Google unit uses mock once and never automatically refreshes", async ({
  page,
}) => {
  const c = googleFixture();
  c.global.mode = "google-only";
  await openHarness(page, c);
  await googleMock(page);
  await cmp(page);
  await start(page);
  await expect(page.locator("ins.adsbygoogle")).toHaveAttribute(
    "data-ad-status",
    "filled",
  );
  await expect(page.locator("ins.adsbygoogle")).toHaveAttribute(
    "data-ad-slot",
    "1234567890",
  );
  await page.evaluate(() => (window as any).MightoraAds.refresh());
  expect(await page.evaluate(() => (window as any).mockPushes)).toBe(1);
  expect(await page.evaluate(() => (window as any).mockLoads)).toBe(1);
});
test("consent withdrawal removes Google, prevents more requests and asks host to unload script", async ({
  page,
}) => {
  const c = googleFixture();
  c.global.mode = "google-only";
  await openHarness(page, c);
  await googleMock(page);
  await cmp(page);
  await start(page);
  await expect(page.locator("ins.adsbygoogle")).toHaveAttribute(
    "data-ad-status",
    "filled",
  );
  await page.evaluate(() => {
    const w = window as any;
    w.tc.vendor.consents[755] = false;
    w.tc.eventStatus = "useractioncomplete";
    w.tcfCallback(w.tc, true);
  });
  await expect(page.locator("ins.adsbygoogle")).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).withdrawals)).toBe(1);
  await expect(page.locator("mightora-ad img")).toBeVisible();
  expect(await page.evaluate(() => (window as any).mockPushes)).toBe(1);
});
test("withdrawal while loader is pending cannot enqueue a Google request", async ({
  page,
}) => {
  const c = googleFixture();
  c.global.mode = "google-only";
  await openHarness(page, c);
  await googleMock(page, false, 500);
  await cmp(page);
  await start(page);
  await expect(page.locator("ins.adsbygoogle")).toHaveCount(1);
  await page.evaluate(() => {
    const w = window as any;
    w.tc.purpose.consents[1] = false;
    w.tc.eventStatus = "useractioncomplete";
    w.tcfCallback(w.tc, true);
  });
  await expect(page.locator("mightora-ad img")).toBeVisible();
  expect(await page.evaluate(() => (window as any).mockPushes || 0)).toBe(0);
});
test("unfilled and blocked Google fall back to cookie-free house only", async ({
  page,
}) => {
  const c = googleFixture();
  c.global.mode = "google-only";
  await openHarness(page, c);
  await googleMock(page, true);
  await cmp(page);
  await start(page);
  await expect(page.locator("mightora-ad img")).toBeVisible();
  await expect(page.locator("ins.adsbygoogle")).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).mockPushes)).toBe(1);
});
test("house provider never touches cookies or browser storage", async ({
  page,
}) => {
  await openHarness(page);
  await page.evaluate(() => {
    const deny = () => {
      throw new Error("Advertising must not read or write persistent storage");
    };
    Object.defineProperty(document, "cookie", { get: deny, set: deny });
    Object.defineProperty(window, "localStorage", { get: deny });
    Object.defineProperty(window, "sessionStorage", { get: deny });
  });
  await start(page);
  await expect(page.locator("mightora-ad img")).toBeVisible();
});
test("unapproved domain, child-directed domain and privacy route are empty", async ({
  page,
}) => {
  const c = fixture();
  c.sites[1]!.audience = "child-directed";
  c.sites[1]!.enabled = false;
  c.sites[1]!.houseAdsApproved = false;
  await openHarness(page, c);
  await start(page);
  await expect(page.locator("mightora-ad img")).toHaveCount(0);
});
test("malicious campaign text stays inert", async ({ page }) => {
  const c = fixture();
  for (const a of c.campaigns)
    a.alt = '<img src=x onerror="window.injected=true">';
  await openHarness(page, c);
  await start(page);
  await expect(page.locator("mightora-ad img")).toHaveAttribute(
    "alt",
    '<img src=x onerror="window.injected=true">',
  );
  expect(await page.evaluate(() => (window as any).injected)).toBeUndefined();
});
for (const width of [320, 375, 768, 1440])
  test(`mobile/desktop shell fits ${width}px and keeps shared branding`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/demo/");
    await expect(page.locator("h1")).toContainText("Small ads.");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator("mightora-header")).toBeVisible();
    await expect(page.locator("mightora-author")).toContainText("Ian Tweedie");
    const siblings = await page
      .locator("mightora-footer")
      .evaluate((el) => [
        el.previousElementSibling?.className,
        el.previousElementSibling?.previousElementSibling?.tagName,
      ]);
    expect(siblings).toEqual(["quality-badges", "MIGHTORA-AUTHOR"]);
    await page.evaluate(() => scrollTo(0, 600));
    expect(
      await page
        .locator("mightora-header")
        .evaluate((el) => getComputedStyle(el).position),
    ).toBe("sticky");
    const offset = await page
      .locator(".quick-jump-nav")
      .evaluate((el) => parseFloat(getComputedStyle(el).top));
    const h = await page
      .locator("mightora-header")
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(offset - h)).toBeLessThan(2);
    if (width <= 768) {
      const menu = page.locator("mightora-header .mobile-menu-btn");
      await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
    }
  });
test("sub-320 available space hides instead of overflowing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 300, height: 800 });
  await openHarness(page);
  await start(page);
  await expect(page.locator("mightora-ad img")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("campaign editor validates, previews and exports a real configuration", async ({
  page,
}) => {
  await page.goto("/demo/editor.html");
  await expect(page.locator("#campaign-list button")).toHaveCount(publishedCampaignCount);
  await expect(page.locator("#preview-gallery img")).toHaveCount(3);
  await page.locator("#campaign-name").fill("Useful feedback");
  await page.getByRole("button", { name: "Save to draft" }).click();
  await expect(page.locator("#status")).toContainText("valid");
  const waiting = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export config.json", exact: true })
    .click();
  const download = await waiting;
  expect(download.suggestedFilename()).toBe("config.json");
  await page.locator("#campaign-destination").fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Save to draft" }).click();
  await expect(page.locator("#status")).toContainText("Invalid");
});
test("offline HTML runs directly from disk with no application requests and matching ZIP", async ({
  page,
}) => {
  const path = resolve("dist/downloads/mightora-shared-ads-offline.html");
  const zip = unzipSync(
    readFileSync("dist/downloads/mightora-shared-ads-offline.zip"),
  );
  expect(Buffer.from(zip["index.html"]!)).toEqual(readFileSync(path));
  let remote = 0;
  page.on("request", (r) => {
    if (/^https?:/.test(r.url())) remote++;
  });
  await page.goto("file://" + path);
  await expect(page.locator("#edition")).toContainText("Offline Edition");
  await expect(page.locator("#campaign-list button")).toHaveCount(publishedCampaignCount);
  await expect(page.locator("#preview-gallery img")).toHaveCount(3);
  await expect(page.locator("#load-published")).toBeDisabled();
  await page.waitForTimeout(100);
  expect(remote).toBe(0);
  expect(
    await page.evaluate(() => document.querySelectorAll("mightora-ad").length),
  ).toBe(0);
});
test("landing and editor have no serious automated accessibility violations", async ({
  page,
}) => {
  for (const url of ["/demo/", "/demo/editor.html"]) {
    await page.goto(url);
    await expect(page.locator("h1")).toBeVisible();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.filter((v) =>
        ["critical", "serious"].includes(v.impact || ""),
      ),
    ).toEqual([]);
    await page.locator("#theme-toggle").click();
    const other = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      other.violations.filter((v) =>
        ["critical", "serious"].includes(v.impact || ""),
      ),
    ).toEqual([]);
  }
});
test("blocked Google loader uses house fallback without a Google request push", async ({
  page,
}) => {
  const c = googleFixture();
  c.global.mode = "google-only";
  await openHarness(page, c);
  await page.route("https://pagead2.googlesyndication.com/**", (r) =>
    r.abort(),
  );
  await cmp(page);
  await start(page);
  await expect(page.locator("mightora-ad img")).toBeVisible();
  expect(await page.evaluate(() => (window as any).mockPushes || 0)).toBe(0);
});
test("known Hero Academy domain is rejected before configuration fetch", async ({
  page,
}) => {
  const body = harness.replace(
    '<script src="/v1/mightora-ads.js"></script>',
    "<script>" + readFileSync("dist/v1/mightora-ads.js", "utf8") + "</script>",
  );
  await page.route("https://reading.heroacademy.app/harness.html", (r) =>
    r.fulfill({ contentType: "text/html", body }),
  );
  await page.goto("https://reading.heroacademy.app/harness.html");
  let requests = 0;
  page.on("request", (r) => {
    if (/config\/config|adverts\/|googlesyndication/.test(r.url())) requests++;
  });
  await start(page, {
    allowedHosts: ["reading.heroacademy.app"],
    siteId: "hero-academy",
  });
  await page.waitForTimeout(100);
  expect(requests).toBe(0);
});
test("privacy paths are excluded before configuration fetch", async ({
  page,
}) => {
  await openHarness(page);
  await page.evaluate(() => history.replaceState({}, "", "/privacy.html"));
  let requests = 0;
  page.on("request", (r) => {
    if (r.url().includes("/config/config.json")) requests++;
  });
  await start(page);
  expect(requests).toBe(0);
});
test("existing cookies are omitted from house configuration and asset requests", async ({
  page,
}) => {
  await openHarness(page);
  await page
    .context()
    .addCookies([
      {
        name: "test-existing-cookie",
        value: "fixture-only",
        url: "http://127.0.0.1:4173/",
      },
    ]);
  const seen: string[] = [];
  page.on("request", (r) => {
    if (/config\/config|adverts\//.test(r.url()))
      seen.push(r.headers().cookie || "");
  });
  await start(page);
  await expect(page.locator("mightora-ad img")).toBeVisible();
  expect(seen.length).toBeGreaterThan(1);
  expect(seen.every((v) => v === "")).toBe(true);
});
test("failed revalidation removes existing house advertisement", async ({
  page,
}) => {
  await openHarness(page);
  await start(page);
  await expect(page.locator("mightora-ad img")).toBeVisible();
  await page.route("**/config/config.json?*", (r) =>
    r.fulfill({ status: 503, body: "unavailable" }),
  );
  await page.evaluate(() => (window as any).MightoraAds.refresh());
  await expect(page.locator("mightora-ad img")).toHaveCount(0);
});
test("editor previews local artwork and rejects script-bearing SVG", async ({
  page,
}) => {
  await page.goto("/demo/editor.html");
  const file = readFileSync("public/adverts/mightora-tools-320x50.svg");
  await page
    .locator("#artwork-files")
    .setInputFiles({
      name: "mightora-tools-320x50.svg",
      mimeType: "image/svg+xml",
      buffer: file,
    });
  await expect(page.locator("#status")).toContainText("Local artwork loaded");
  await page
    .locator("#artwork-files")
    .setInputFiles({
      name: "unsafe.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="50"><script>alert(1)</script></svg>',
      ),
    });
  await expect(page.locator("#status")).toContainText("Unsafe SVG");
});
