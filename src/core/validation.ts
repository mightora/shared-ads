import validate from "./schema.generated.js";
import { SIZES, type Config } from "./types";
export function httpsURL(value: string, origins?: string[]): URL | null {
  try {
    if (
      !/^https:\/\//.test(value) ||
      /[\s<>"'`\\]/.test(value) ||
      /%(?:0[0-9a-f]|1[0-9a-f]|7f)/i.test(value)
    )
      return null;
    const u = new URL(value);
    if (
      u.username ||
      u.password ||
      u.search ||
      u.hash ||
      (u.port && u.port !== "443")
    )
      return null;
    if (origins && !origins.includes(u.origin)) return null;
    return u;
  } catch {
    return null;
  }
}
export function isChildDomain(host: string, path = "/"): boolean {
  return (
    ["heroacademy.app", "heroacadmey.app"].some(
      (d) => host === d || host.endsWith("." + d),
    ) ||
    (host.endsWith(".github.io") && /^\/hero-academy(?:[-/.]|$)/i.test(path))
  );
}
export function pathRule(rule: string): boolean {
  return (
    /^\/(?!\/)[^?#\s\\<>]*\*?$/.test(rule) &&
    !rule.slice(0, -1).includes("*") &&
    !rule.includes("..") &&
    !/%(?:2e|2f|5c)/i.test(rule)
  );
}
export function validateConfig(
  value: unknown,
): { ok: true; config: Config } | { ok: false; errors: string[] } {
  if (!validate(value))
    return {
      ok: false,
      errors: (validate.errors || []).map(
        (e) => `${e.instancePath || "/"} ${e.message}`,
      ),
    };
  const c = value as Config,
    errors: string[] = [];
  const unique = (values: string[], name: string) => {
    if (new Set(values).size !== values.length)
      errors.push(`Duplicate ${name}`);
  };
  const origins = [...c.global.imageOrigins, ...c.global.destinationOrigins];
  for (const o of origins)
    if (httpsURL(o)?.origin !== o) errors.push(`Invalid HTTPS origin: ${o}`);
  unique(
    c.sites.map((s) => s.id),
    "site ID",
  );
  unique(
    c.campaigns.map((s) => s.id),
    "campaign ID",
  );
  const dates = (a: {
    start: string;
    end: string;
    minScreen: number;
    maxScreen: number;
    id: string;
  }) => {
    const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    if (
      !iso.test(a.start) ||
      !iso.test(a.end) ||
      !Number.isFinite(Date.parse(a.start)) ||
      !Number.isFinite(Date.parse(a.end)) ||
      Date.parse(a.start) >= Date.parse(a.end) ||
      new Date(a.start).toISOString().replace(".000", "") !== a.start ||
      new Date(a.end).toISOString().replace(".000", "") !== a.end
    )
      errors.push(`Invalid UTC dates: ${a.id}`);
    if (a.minScreen > a.maxScreen) errors.push(`Invalid screen range: ${a.id}`);
  };
  for (const s of c.sites) {
    if (
      s.domain.includes("..") ||
      s.domain.includes("*") ||
      new URL(`https://${s.domain}`).hostname !== s.domain
    )
      errors.push(`Invalid exact domain: ${s.id}`);
    for (const p of [...s.pathPrefixes, ...s.exclusions, ...s.longContentPaths])
      if (!pathRule(p)) errors.push(`Invalid path rule: ${p}`);
    if (s.pathPrefixes.some((p) => p.endsWith("*")))
      errors.push(`Path prefixes cannot contain wildcards: ${s.id}`);
    if (
      s.audience === "child-directed" &&
      (s.enabled || s.googleEnabled || s.houseAdsApproved)
    )
      errors.push(`Child-directed site must remain disabled: ${s.id}`);
    if (isChildDomain(s.domain) && s.audience !== "child-directed")
      errors.push(`Hero Academy must be child-directed: ${s.id}`);
    if (s.categories.some((v) => !c.global.categories.includes(v)))
      errors.push(`Unknown site category: ${s.id}`);
    unique(
      s.googleUnits.map((a) => a.id),
      "unit ID",
    );
    for (const a of s.googleUnits) {
      dates(a);
      if (c.campaigns.some((h) => h.id === a.id))
        errors.push(`Unit/campaign ID collision: ${a.id}`);
      if (!s.placements[a.placement])
        errors.push(`Unit placement not registered: ${a.id}`);
      if (
        a.format === "responsive-horizontal" &&
        !["728x90", "468x60", "320x50"].includes(a.size)
      )
        errors.push(`Responsive units must be horizontal: ${a.id}`);
    }
    if (
      s.googleEnabled &&
      (!s.googleApproved ||
        !c.global.google.publisherId ||
        !c.global.google.autoAdsDisabledConfirmed ||
        !c.global.google.certifiedCmpIds.length)
    )
      errors.push(`Google setup incomplete: ${s.id}`);
  }
  for (const a of c.campaigns) {
    dates(a);
    if (!c.global.categories.includes(a.category))
      errors.push(`Unknown campaign category: ${a.id}`);
    if (a.sites.some((id) => !c.sites.some((s) => s.id === id)))
      errors.push(`Unknown campaign site: ${a.id}`);
    const d = httpsURL(a.destination, c.global.destinationOrigins);
    if (!d || /\/(?:click|redirect|track)(?:\/|$)/i.test(d.pathname))
      errors.push(`Invalid direct destination: ${a.id}`);
    unique(
      a.variants.map((v) => `${v.width}x${v.height}`),
      "image dimensions",
    );
    for (const v of a.variants) {
      const u = httpsURL(v.src, c.global.imageOrigins);
      if (
        !u ||
        !SIZES.includes(`${v.width}x${v.height}` as (typeof SIZES)[number]) ||
        !/^\/[a-zA-Z0-9_./-]*adverts\/[a-zA-Z0-9_-]+\.(?:svg|png|jpe?g|webp)$/.test(
          u.pathname,
        ) ||
        u.pathname.includes("..")
      )
        errors.push(`Invalid image variant: ${a.id}`);
    }
  }
  return errors.length ? { ok: false, errors } : { ok: true, config: c };
}
