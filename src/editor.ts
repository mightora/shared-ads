import { validateConfig, httpsURL } from "./core/validation";
import { eligible, choose } from "./core/selection";
import {
  PLACEMENTS,
  SIZES,
  type Config,
  type Campaign,
  type Placement,
} from "./core/types";
import { localArtwork } from "./editor-image";
import { strToU8, zipSync } from "fflate";
declare const __CONFIG__: Config;
declare const __ASSETS__: Record<string, string>;
const localImages = new Map<string, { url: string; bytes: Uint8Array }>();
const offline =
  location.protocol === "file:" ||
  document.documentElement.dataset.offline === "true";
let draft: Config = structuredClone(__CONFIG__),
  selected = draft.campaigns[0]?.id || "",
  published: Config | undefined;
const $ = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const input = (id: string) => $<HTMLInputElement>(id);
const value = (id: string) => input(id).value;
function status(message: string, bad = false): void {
  $("status").textContent = message;
  $("status").classList.toggle("error", bad);
}
function download(
  name: string,
  bytes: Uint8Array | string,
  type = "application/json",
): void {
  const blob = new Blob(
    [typeof bytes === "string" ? bytes : new Uint8Array(bytes)],
    { type },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function list(): void {
  const root = $("campaign-list");
  root.replaceChildren();
  for (const a of draft.campaigns) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "campaign-item";
    b.setAttribute("aria-pressed", String(a.id === selected));
    const name = document.createElement("strong");
    name.textContent = a.name;
    const note = document.createElement("span");
    note.textContent =
      (!a.enabled
        ? "Disabled"
        : Date.parse(a.end) <= Date.now()
          ? "Expired"
          : Date.parse(a.start) > Date.now()
            ? "Scheduled"
            : "Active") + ` · weight ${a.weight}`;
    b.append(name, note);
    b.addEventListener("click", () => {
      selected = a.id;
      populate();
      list();
    });
    root.append(b);
  }
  const sites = $("site-list");
  sites.replaceChildren();
  for (const s of draft.sites) {
    const li = document.createElement("li");
    li.textContent = `${s.domain}${s.pathPrefixes.join(", ")} — ${s.audience === "child-directed" ? "Children: advertising blocked" : s.enabled ? s.mode : "Disabled"}`;
    sites.append(li);
  }
  const c = draft.campaigns.find((a) => a.id === selected);
  $("editor-heading").textContent = c ? "Edit campaign" : "New campaign";
  input("global-enabled").checked = draft.global.enabled;
  input("kill-switch").checked = draft.global.killSwitch;
  $<HTMLSelectElement>("rotation").value = draft.global.rotation;
  $<HTMLSelectElement>("mode").value = draft.global.mode;
  $("raw-config").textContent = "";
  $<HTMLTextAreaElement>("raw-config").value = JSON.stringify(draft, null, 2);
  const ps = $<HTMLSelectElement>("preview-site");
  const old = ps.value;
  ps.replaceChildren();
  for (const s of draft.sites) {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = s.domain;
    ps.append(o);
  }
  if (draft.sites.some((s) => s.id === old)) ps.value = old;
  preview();
}
const fields = [
  "id",
  "name",
  "description",
  "alt",
  "destination",
  "start",
  "end",
  "weight",
  "minScreen",
  "maxScreen",
  "category",
  "disclosure",
] as const;
function populate(): void {
  const a = draft.campaigns.find((a) => a.id === selected);
  for (const k of fields)
    input("campaign-" + k).value = String(
      a?.[k] ??
        (
          {
            weight: 20,
            minScreen: 0,
            maxScreen: 10000,
            category: "feedback",
            disclosure: "House advertisement",
            start: "2026-01-01T00:00:00Z",
            end: "2030-01-01T00:00:00Z",
          } as Record<string, unknown>
        )[k] ??
        "",
    );
  input("campaign-enabled").checked = a?.enabled ?? true;
  input("campaign-sites").value = (
    a?.sites ||
    draft.sites.filter((s) => s.audience === "general").map((s) => s.id)
  ).join(", ");
  input("campaign-placements").value = (
    a?.placements || ["content-bottom"]
  ).join(", ");
  $<HTMLTextAreaElement>("campaign-variants").value = JSON.stringify(
    a?.variants || [
      {
        src: "https://mightora.github.io/shared-ads/adverts/feedback-320x50.svg",
        width: 320,
        height: 50,
      },
    ],
    null,
    2,
  );
}
function validate(c: unknown): c is Config {
  const result = validateConfig(c);
  if (!result.ok) {
    status(result.errors.join("\n"), true);
    return false;
  }
  status("Configuration is valid. No changes have been published.");
  return true;
}
function preview(): void {
  const gallery = $("preview-gallery");
  gallery.replaceChildren();
  const a = draft.campaigns.find((a) => a.id === selected);
  for (const size of SIZES.slice(0, 3)) {
    const [w, h] = size.split("x").map(Number);
    const frame = document.createElement("div");
    frame.className = "size-preview";
    const label = document.createElement("p");
    label.textContent = size.replace("x", " × ");
    frame.append(label);
    const v = a?.variants.find((v) => v.width === w && v.height === h);
    if (v) {
      const u = httpsURL(v.src);
      const filename = u?.pathname.split("/").at(-1) || "";
      const data =
        u &&
        u.origin === "https://mightora.github.io" &&
        (localImages.get(filename)?.url || __ASSETS__[filename]);
      if (data) {
        const img = document.createElement("img");
        img.src = data;
        img.alt = a!.alt;
        img.width = w!;
        img.height = h!;
        frame.append(img);
      } else {
        const p = document.createElement("p");
        p.textContent =
          "External image preview requires a separate review. No request was made.";
        frame.append(p);
      }
    } else {
      const p = document.createElement("p");
      p.textContent = "No variant for this size.";
      frame.append(p);
    }
    gallery.append(frame);
  }
  const site = draft.sites.find((s) => s.id === value("preview-site"));
  const results = $("selection-preview");
  results.replaceChildren();
  if (site) {
    const width = Number(value("preview-width"));
    const candidates = eligible(draft, site, {
      hostname: site.domain,
      path: site.pathPrefixes[0] || "/",
      placement: value("preview-placement") as Placement,
      width,
      screenWidth: width,
      now: Date.now(),
      googleConsent: false,
      words: 0,
    });
    const sample = choose(candidates, draft.global.rotation);
    results.textContent = candidates.length
      ? `${candidates.length} eligible house campaigns. Example selection: ${sample?.id}. Google is never requested by this editor.`
      : "No eligible advert for this combination. The placement stays empty.";
  }
}
$("campaign-form").addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    const a: Record<string, unknown> = {};
    for (const k of fields)
      a[k] = ["weight", "minScreen", "maxScreen"].includes(k)
        ? Number(value("campaign-" + k))
        : value("campaign-" + k);
    a.enabled = input("campaign-enabled").checked;
    a.sites = value("campaign-sites")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    a.placements = value("campaign-placements")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    a.variants = JSON.parse(value("campaign-variants"));
    const next = structuredClone(draft);
    const index = next.campaigns.findIndex((c) => c.id === selected);
    if (index < 0) next.campaigns.push(a as unknown as Campaign);
    else next.campaigns[index] = a as unknown as Campaign;
    if (validate(next)) {
      draft = next;
      selected = String(a.id);
      list();
    }
  } catch {
    status("Image variants must contain valid JSON.", true);
  }
});
$("new-campaign").addEventListener("click", () => {
  selected = "";
  populate();
  list();
  input("campaign-id").focus();
});
$("delete-campaign").addEventListener("click", () => {
  if (!selected) return;
  draft.campaigns = draft.campaigns.filter((a) => a.id !== selected);
  selected = draft.campaigns[0]?.id || "";
  populate();
  list();
  status("Campaign removed from this draft only.");
});
$("config-import").addEventListener("change", async () => {
  const file = $<HTMLInputElement>("config-import").files?.[0];
  if (!file) return;
  if (file.size > 524288) {
    status("Configuration exceeds 512 KB.", true);
    return;
  }
  try {
    const c: unknown = JSON.parse(await file.text());
    if (validate(c)) {
      draft = c;
      selected = draft.campaigns[0]?.id || "";
      populate();
      list();
    }
  } catch {
    status("Cannot read JSON configuration.", true);
  }
});
$("apply-json").addEventListener("click", () => {
  try {
    const c: unknown = JSON.parse(value("raw-config"));
    if (validate(c)) {
      draft = c;
      selected = draft.campaigns[0]?.id || "";
      populate();
      list();
    }
  } catch {
    status("Invalid JSON.", true);
  }
});
for (const id of ["global-enabled", "kill-switch", "rotation", "mode"])
  $(id).addEventListener("change", () => {
    draft.global.enabled = input("global-enabled").checked;
    draft.global.killSwitch = input("kill-switch").checked;
    draft.global.rotation = value("rotation") as Config["global"]["rotation"];
    draft.global.mode = value("mode") as Config["global"]["mode"];
    list();
  });
$("export-json").addEventListener("click", () => {
  if (validate(draft))
    download("config.json", JSON.stringify(draft, null, 2) + "\n");
});
$("export-pr").addEventListener("click", () => {
  const revision = value("revision");
  const c = structuredClone(draft);
  c.revision = revision;
  if (!validate(c)) return;
  draft = c;
  const envelope = { schemaVersion: 1, revision };
  const files = {
    "global.json": { ...envelope, global: c.global },
    "sites.json": { ...envelope, sites: c.sites },
    "campaigns.json": { ...envelope, campaigns: c.campaigns },
  };
  const zip: Record<string, Uint8Array> = {};
  for (const [name, data] of Object.entries(files))
    zip["config/" + name] = strToU8(JSON.stringify(data, null, 2) + "\n");
  for (const [name, image] of localImages) {
    if (
      c.campaigns.some((a) =>
        a.variants.some((v) => new URL(v.src).pathname.endsWith("/" + name)),
      )
    )
      zip["public/adverts/" + name] = image.bytes;
  }
  zip["CHANGE_INSTRUCTIONS.md"] = strToU8(
    "Upload the three JSON files into config/ using an authenticated GitHub session. Select Create a new branch and start a pull request. CI validates and generates the published aggregate; review before merging. Do not upload secrets.",
  );
  download("campaign-change.zip", zipSync(zip), "application/zip");
  list();
});
$("load-published").addEventListener("click", async () => {
  if (offline) {
    status(
      "Offline edition: remote configuration loading is disabled. Import a file instead.",
    );
    return;
  }
  try {
    const res = await fetch(
      "../config/config.json?epoch=" + Math.floor(Date.now() / 30000),
      {
        cache: "no-store",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        redirect: "error",
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!res.ok) throw Error();
    const text = await res.text();
    if (text.length > 524288) throw Error();
    const c: unknown = JSON.parse(text);
    if (!validate(c)) return;
    published = c;
    $("published-config").textContent = JSON.stringify(published, null, 2);
    status(
      "Published revision loaded for review. Your draft has not been replaced.",
    );
  } catch {
    status(
      "Published configuration unavailable. Import a checked-out file instead.",
      true,
    );
  }
});
$("artwork-files").addEventListener("change", async () => {
  const files = $<HTMLInputElement>("artwork-files").files;
  if (!files) return;
  for (const file of files) {
    try {
      localImages.set(file.name, await localArtwork(file));
      status(
        "Local artwork loaded. Referenced images will be included in the exported change ZIP.",
      );
    } catch (error) {
      status(
        error instanceof Error ? error.message : "Unable to preview artwork.",
        true,
      );
    }
  }
  preview();
});
for (const id of ["preview-site", "preview-placement", "preview-width"])
  $(id).addEventListener("change", preview);
$("network-refresh").addEventListener("click", () => {
  const entries = performance.getEntriesByType(
    "resource",
  ) as PerformanceResourceTiming[];
  const origins = new Set(
    entries.map((e) => {
      try {
        return new URL(e.name).origin;
      } catch {
        return "inline";
      }
    }),
  );
  $("network-output").textContent =
    `${entries.length} resource entries; ${[...origins].join(", ") || "no resource origins reported"}. This is a partial view; inspect Developer Tools → Network for a full trace.`;
});
input("revision").value = draft.revision;
populate();
list();
if (offline) {
  $("load-published").setAttribute("disabled", "");
  $("edition").textContent =
    "Offline Edition – No Internet Connection Required";
}
