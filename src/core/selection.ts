import type { Candidate, Config, Context, Site, CommonAd } from "./types";
import { isChildDomain } from "./validation";
export function matchesPath(path: string, rule: string): boolean {
  return rule.endsWith("*")
    ? path.startsWith(rule.slice(0, -1))
    : path === rule;
}
export function normalPath(path: string): string {
  try {
    return decodeURIComponent(path).replace(/\/{2,}/g, "/");
  } catch {
    return "/privacy";
  }
}
export function pageExcluded(path: string): boolean {
  return /(?:^|\/)(?:privacy(?:-policy)?|cookies?(?:-policy)?|consent|settings)(?:\/|\.|$)/i.test(
    normalPath(path),
  );
}
export function siteFor(
  c: Config,
  id: string,
  hostname: string,
  path: string,
): Site | undefined {
  if (isChildDomain(hostname, path) || pageExcluded(path)) return;
  return c.sites.find(
    (s) =>
      s.id === id &&
      s.domain === hostname &&
      s.audience === "general" &&
      s.enabled &&
      s.mode !== "off" &&
      s.pathPrefixes.some(
        (p) =>
          p === "/" ||
          path === p.replace(/\/$/, "") ||
          path.startsWith(p.endsWith("/") ? p : p + "/"),
      ) &&
      !s.exclusions.some((p) => matchesPath(path, p)),
  );
}
export function pageLimit(
  c: Config,
  s: Site,
  path: string,
  words: number,
): number {
  const long =
    s.longContentPaths.some((r) => matchesPath(path, r)) && words >= 800;
  return Math.min(c.global.maxAdsPerPage, s.maxAdsPerPage, long ? 2 : 1);
}
export function googleEnabled(c: Config, s: Site): boolean {
  return (
    c.global.enabled &&
    !c.global.killSwitch &&
    c.global.googleEnabled &&
    s.googleEnabled &&
    s.googleApproved &&
    c.global.mode !== "house-only" &&
    s.mode !== "house-only" &&
    c.global.mode !== "off" &&
    s.mode !== "off" &&
    !!c.global.google.publisherId &&
    c.global.google.autoAdsDisabledConfirmed
  );
}
export function active(a: CommonAd, ctx: Context): boolean {
  return (
    a.enabled &&
    a.weight > 0 &&
    Date.parse(a.start) <= ctx.now &&
    ctx.now < Date.parse(a.end) &&
    a.minScreen <= ctx.screenWidth &&
    ctx.screenWidth <= a.maxScreen
  );
}
export function eligible(c: Config, s: Site, ctx: Context): Candidate[] {
  if (
    !c.global.enabled ||
    c.global.killSwitch ||
    c.global.mode === "off" ||
    !s.enabled ||
    s.audience !== "general" ||
    s.mode === "off" ||
    !siteFor(c, s.id, ctx.hostname, ctx.path) ||
    !pageLimit(c, s, ctx.path, ctx.words)
  )
    return [];
  const p = s.placements[ctx.placement];
  if (!p?.enabled) return [];
  if (
    ctx.placement === "article-middle" &&
    (!s.longContentPaths.some((r) => matchesPath(ctx.path, r)) ||
      ctx.words < 800)
  )
    return [];
  const fits = (w: number, h: number) =>
    ctx.width >= w &&
    c.global.allowedSizes.includes(`${w}x${h}` as never) &&
    s.allowedSizes.includes(`${w}x${h}` as never) &&
    p.sizes.includes(`${w}x${h}` as never);
  const out: Candidate[] = [];
  const googleOK = googleEnabled(c, s) && ctx.googleConsent;
  const houseMode = c.global.mode !== "google-only" && s.mode !== "google-only";
  const allowHouse =
    c.global.houseEnabled &&
    s.houseAdsApproved &&
    (houseMode || (!googleOK && c.global.fallback === "house"));
  if (allowHouse)
    for (const a of c.campaigns) {
      if (
        !active(a, ctx) ||
        !a.sites.includes(s.id) ||
        !a.placements.includes(ctx.placement) ||
        !s.categories.includes(a.category) ||
        !c.global.categories.includes(a.category)
      )
        continue;
      const v = a.variants
        .filter((v) => fits(v.width, v.height))
        .sort((a, b) => b.width - a.width || a.height - b.height)[0];
      if (v)
        out.push({
          id: a.id,
          kind: "house",
          weight: a.weight,
          width: v.width,
          height: v.height,
          campaign: a,
          variant: v,
        });
    }
  if (googleOK)
    for (const a of s.googleUnits) {
      const [w, h] = a.size.split("x").map(Number);
      if (
        w &&
        h &&
        a.placement === ctx.placement &&
        active(a, ctx) &&
        fits(w, h)
      )
        out.push({
          id: a.id,
          kind: "google",
          weight: a.weight,
          width: w,
          height: h,
          unit: a,
        });
    }
  return out;
}
/** Page-memory only. An advert has one entry regardless of its responsive variants. */
export function choose(
  candidates: Candidate[],
  rotation: "equal" | "weighted",
  used: ReadonlySet<string> = new Set(),
  random: () => number = Math.random,
): Candidate | undefined {
  const available = candidates.filter(
    (a) => a.weight > 0 && Number.isFinite(a.weight),
  );
  const diverse = available.filter((a) => !used.has(a.id));
  const pool = diverse.length ? diverse : available;
  const total = pool.reduce(
    (n, a) => n + (rotation === "equal" ? 1 : a.weight),
    0,
  );
  if (!total) return;
  const r = random();
  if (!Number.isFinite(r) || r < 0 || r >= 1) return;
  let remaining = r * total;
  for (const a of pool) {
    remaining -= rotation === "equal" ? 1 : a.weight;
    if (remaining < 0) return a;
  }
  return pool.at(-1);
}
