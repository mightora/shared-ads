import { build } from "esbuild";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  cpSync,
  rmSync,
  existsSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { zipSync, strToU8 } from "fflate";
import * as yaml from "js-yaml";
execFileSync("node", ["scripts/schema.mjs"], { stdio: "inherit" });
execFileSync("node", ["--import", "tsx", "scripts/config.ts"], {
  stdio: "inherit",
});
execFileSync("python", ["scripts/check-assets.py"], { stdio: "inherit" });
const cfg = JSON.parse(readFileSync("config/config.json", "utf8"));
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
rmSync("dist", { recursive: true, force: true });
for (const path of [
  "dist/v1",
  "dist/demo/vendor",
  "dist/config/versions",
  "dist/downloads",
  `dist/releases/${pkg.version}`,
])
  mkdirSync(path, { recursive: true });
const common = {
  bundle: true,
  minify: true,
  target: ["es2022"],
  legalComments: "none",
};
await build({
  ...common,
  entryPoints: ["src/index.ts"],
  format: "iife",
  globalName: "MightoraAds",
  outfile: "dist/v1/mightora-ads.js",
});
await build({
  ...common,
  entryPoints: ["src/index.ts"],
  format: "esm",
  outfile: "dist/v1/mightora-ads.mjs",
});
const runtime = readFileSync("dist/v1/mightora-ads.js");
const gz = gzipSync(runtime).length;
if (gz > 24576) throw Error(`Runtime budget exceeded: ${gz} gzip bytes`);
cpSync("dist/v1", `dist/releases/${pkg.version}`, { recursive: true });
const assets = {};
for (const a of cfg.campaigns)
  for (const v of a.variants) {
    const name = new URL(v.src).pathname.split("/").at(-1);
    const mime = name.endsWith(".svg")
      ? "image/svg+xml"
      : name.endsWith(".png")
        ? "image/png"
        : name.endsWith(".webp")
          ? "image/webp"
          : "image/jpeg";
    assets[name] =
      `data:${mime};base64,` +
      readFileSync("public/adverts/" + name).toString("base64");
  }
const editorResult = await build({
  ...common,
  entryPoints: ["src/editor.ts"],
  format: "iife",
  write: false,
  define: {
    __CONFIG__: JSON.stringify(cfg),
    __ASSETS__: JSON.stringify(assets),
  },
});
const editorJS = editorResult.outputFiles[0].text;
writeFileSync("dist/demo/editor.js", editorJS);
await build({
  ...common,
  entryPoints: ["demo/brand.ts"],
  outfile: "dist/demo/brand.js",
});
await build({
  ...common,
  entryPoints: ["demo/demo.ts"],
  outfile: "dist/demo/demo.js",
});
await build({
  ...common,
  stdin: {
    contents: 'import * as yaml from \"js-yaml\"; window.jsyaml = yaml;',
    resolveDir: process.cwd(),
  },
  outfile: "dist/demo/vendor/js-yaml.js",
});
cpSync("public/adverts", "dist/adverts", { recursive: true });
cpSync("demo/assets", "dist/demo/assets", { recursive: true });
cpSync("demo/vendor", "dist/demo/vendor", { recursive: true });
cpSync("demo/styles.css", "dist/demo/styles.css");
cpSync("config", "dist/config", { recursive: true });
const footerSource = readFileSync("demo/footer.yaml", "utf8");
const footer = yaml.load(footerSource);
if (!Array.isArray(footer.sections)) throw Error("Invalid shared footer");
writeFileSync("dist/demo/footer.yaml", JSON.stringify(footer));
// Preserve historical revisions from repository history on Pages rebuilds (checkout fetch-depth: 0).
try {
  const commits = execFileSync(
    "git",
    [
      "log",
      "-30",
      "--format=%H",
      "--",
      "config/global.json",
      "config/sites.json",
      "config/campaigns.json",
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  )
    .trim()
    .split("\n")
    .filter(Boolean);
  for (const sha of commits) {
    try {
      const parts = ["global", "sites", "campaigns"].map((n) =>
        JSON.parse(
          execFileSync("git", ["show", `${sha}:config/${n}.json`], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
          }),
        ),
      );
      if (
        parts.every(
          (p) => p.revision === parts[0].revision && p.schemaVersion === 1,
        )
      ) {
        const rev = parts[0].revision;
        if (/^[a-zA-Z0-9._-]{1,64}$/.test(rev))
          writeFileSync(
            `dist/config/versions/${rev}.json`,
            JSON.stringify(Object.assign({}, ...parts), null, 2) + "\n",
          );
      }
    } catch {
      /* commit may predate schema */
    }
  }
} catch {
  /* fresh repository */
}
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const logo =
  "https://raw.githubusercontent.com/mightora/mightora.io/main/static/images/mightoraIoLogo4-200x900.png";
const logoData =
  "data:image/png;base64," +
  readFileSync("demo/assets/mightora-logo.png").toString("base64");
const authorImage = (offline) =>
  offline
    ? "data:image/png;base64," +
      readFileSync("demo/assets/ian-tweedie.png").toString("base64")
    : "https://cdn.jsdelivr.net/gh/mightora/shared-ui@main/ian-tweedie-sq2.png";
const blogLogo = (offline) =>
  offline
    ? "data:image/png;base64," +
      readFileSync("demo/assets/techtweedie.png").toString("base64")
    : "https://cdn.jsdelivr.net/gh/mightora/shared-ui@main/main-logo.png";
const author = (offline) =>
  `<mightora-author class="author-section"><div class="author-section-overlay"><div class="author-section-inner"><div class="author-photos"><img src="${authorImage(offline)}" alt="Ian Tweedie" class="author-avatar" loading="lazy"><img src="${blogLogo(offline)}" alt="TechTweedie" class="author-blog-logo" loading="lazy"></div><div class="author-text"><h2 class="author-heading">Built by TechTweedie</h2><p class="author-bio">Mightora Shared Ads is a free tool created by <strong>Ian Tweedie</strong> — also known online as <strong>TechTweedie</strong>. Ian is a technology consultant and developer based in North East England with a background in enterprise IT, cloud infrastructure and developer tooling. He builds free, practical tools and writes about technology on his blog.</p><div class="author-links"><a class="author-link" href="https://techtweedie.github.io" target="_blank" rel="noopener noreferrer">Blog</a><a class="author-link" href="https://github.com/itweedie" target="_blank" rel="noopener noreferrer">GitHub</a></div></div></div></div></mightora-author>`;
const badges = `<div class="quality-badges" aria-label="Open source evidence"><p>Open source. Independently inspectable. Workflow results are available on GitHub.</p><a href="https://github.com/mightora/shared-ads/actions/workflows/ci.yml">CI · test results ↗</a><a href="https://github.com/mightora/shared-ads/actions/workflows/codeql.yml">CodeQL · scan results ↗</a><a href="https://github.com/mightora/shared-ads/blob/main/LICENSE">MIT licence ↗</a><a href="https://github.com/mightora/shared-ads">View source ↗</a><a href="https://github.com/mightora/shared-ads/actions/workflows/pages.yml">Pages · deployment ↗</a></div>`;
const offlineFooter = `<div class="container footer-main">${footer.sections.map((s) => `<div class="footer-col"><div class="footer-section-title">${esc(s.title)}</div><ul class="footer-links">${s.links.map((l) => `<li><a href="${esc(l.url)}">${esc(l.name)}</a></li>`).join("")}</ul></div>`).join("")}</div>`;
function shell(
  title,
  content,
  { offline = false, ads = true, editor = false, quick = "" } = {},
) {
  const csp = offline
    ? `default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`
    : `default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' blob: data: https://raw.githubusercontent.com https://techtweedie.github.io https://mightora.github.io https://cdn.jsdelivr.net; connect-src 'self' https://cdn.jsdelivr.net https://mightora.github.io; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`;
  const header = offline
    ? `<mightora-header class="site-header"><div class="offline-header"><img src="${logoData}" alt="Mightora.io"><strong>Shared Ads</strong><nav aria-label="Main navigation"><a href="#workspace">Campaigns</a><a href="#preview">Preview</a><a href="#publish">Export</a></nav></div></mightora-header>`
    : `<mightora-header site-name="Shared Ads" site-url="./" logo-light="${logo}" logo-dark="${logo}" nav-links='[{"label":"Overview","url":"./"},{"label":"Campaign editor","url":"editor.html"},{"label":"Integration","url":"guide.html"},{"label":"Source ↗","url":"https://github.com/mightora/shared-ads","ext":true}]'><div class="offline-header"><img src="assets/mightora-logo.png" alt="Mightora.io" width="140"><a href="./">Shared Ads</a><nav><a href="editor.html">Campaign editor</a><a href="guide.html">Integration</a></nav></div></mightora-header>`;
  return `<!doctype html><html lang="en" data-ads="${ads && !editor && !offline ? "on" : "off"}" ${offline ? 'data-offline="true"' : ""}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="referrer" content="no-referrer"><meta name="description" content="Small, deliberately placed advertising for Mightora. Cookie-free feedback, blog and tool campaigns. Static, open-source and centrally managed."><title>${esc(title)} · Mightora Shared Ads</title>${offline ? "<style>" + readFileSync("demo/vendor/shared.css", "utf8").replace(/url\([^)]*\)/g, "none") + "\n" + readFileSync("demo/styles.css", "utf8") + "</style>" : '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mightora/shared-ui@main/shared.css"><link rel="stylesheet" href="styles.css"><script defer src="vendor/js-yaml.js"></script><script defer src="https://cdn.jsdelivr.net/gh/mightora/shared-ui@main/components.js"></script><script defer src="brand.js"></script>'}</head><body><a class="skip-link" href="#main">Skip to content</a>${header}${quick ? `<nav class="quick-jump-nav" aria-label="On this page">${quick}</nav>` : ""}<main id="main" class="app">${content}</main>${author(offline)}${badges}<mightora-footer class="site-footer">${offline ? offlineFooter : ""}<div class="container"><div class="footer-bottom"><div class="footer-copy">Mightora Shared Ads by <a href="https://mightora.io" target="_blank" rel="noopener noreferrer">Mightora</a>. Open source under the MIT licence.</div><div class="footer-bottom-links"><a href="${offline ? "#network" : "privacy.html"}">Privacy &amp; network information</a></div></div></div></mightora-footer>${offline ? "<script>" + editorJS.replaceAll("</script", "<\\/script") + "</script><script>" + readFileSync("dist/demo/brand.js", "utf8") + "</script>" : `<script defer src="${editor ? "editor" : "demo"}.js"></script>`}</body></html>`;
}
const home = `<section class="hero" id="overview"><div><span class="eyebrow">MIGHTORA / SHARED ADVERTISING</span><h1>Small ads.<br><span>Clear boundaries.</span></h1><p class="lead">A little space for useful messages. Feedback, your blog and the tools you build — quietly shared, exactly where you choose.</p><div class="actions"><a class="button primary" href="editor.html">Open campaign editor ↗</a><a class="button" href="guide.html">Integration guide</a></div><p class="tiny">Static by design. No backend. No cookies for house messages.</p></div><div class="hero-preview"><div class="preview-bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><span>YOUR WEBSITE · APPROVED PLACEMENT</span></div><div class="preview-body"><span class="tag">Your content comes first</span><h3>A useful tool, with room to breathe.</h3><div class="placeholder-line"></div><div class="placeholder-line"></div><div class="placeholder-line short"></div><img width="320" height="50" src="../adverts/feedback-320x50.svg" alt="Example house message: Share a little feedback."><p class="tiny">A static image. An ordinary link. No tracking.</p></div></div></section><div class="principles"><div><strong>Deliberate placement</strong><span>You add every advertising slot.</span></div><div><strong>Cookie-free house messages</strong><span>No identifiers or click measurement.</span></div><div><strong>One central repository</strong><span>Validated configuration. Reviewed changes.</span></div><div><strong>A real off switch</strong><span>Global, site, page and placement controls.</span></div></div><section class="section" id="examples"><div class="section-top"><div><span class="eyebrow">EXPLORE THE DEMO</span><h2>See the boundaries in action.</h2></div><p>These demonstrations use static house messages only. Google is disabled, and no live Google impressions are generated.</p></div><div class="grid">${[
  [
    "Landing page",
    "A single placement after the main content.",
    "landing.html",
  ],
  [
    "Long article",
    "Two deliberate placements. Different campaigns.",
    "article.html",
  ],
  [
    "Developer tool",
    "A clean editor area, with advertising kept outside.",
    "tool.html",
  ],
  [
    "Mobile layout",
    "A 320 × 50 banner with no horizontal overflow.",
    "mobile.html",
  ],
  [
    "Advertising disabled",
    "The underlying page works with zero ad requests.",
    "disabled.html",
  ],
  [
    "Consent refused",
    "Cookie-free house messages; Google never loads.",
    "refused.html",
  ],
]
  .map(
    ([h, p, u], i) =>
      `<a class="card" href="${u}"><span class="num">0${i + 1} / DEMONSTRATION</span><h3>${h}</h3><p>${p}</p><span class="arrow" aria-hidden="true">↗</span></a>`,
  )
  .join(
    "",
  )}</div></section><section id="sizes" class="section"><div class="section-top"><div><span class="eyebrow">THREE PRIMARY SIZES</span><h2>Compact. Readable. Out of the way.</h2></div><p>Images retain their aspect ratio. Live placements stay empty when the available width is too small.</p></div><div class="sizes">${["320x50", "468x60", "728x90"].map((s) => `<div class="size-preview"><p>${s.replace("x", " × ")} · static house message preview</p><img src="../adverts/feedback-${s}.svg" width="${s.split("x")[0]}" height="${s.split("x")[1]}" alt="Example feedback invitation, ${s}"></div>`).join("")}</div></section><section class="section" id="integrate"><span class="eyebrow">EXPLICIT OPT-IN</span><h2>One component. Only where you put it.</h2><pre class="code">&lt;mightora-ad placement="content-bottom"&gt;&lt;/mightora-ad&gt;</pre><p class="tiny">The site must also opt in locally and be approved in the central configuration. Child-directed Hero Academy sites remain blocked.</p></section><mightora-ad placement="footer-above-author"></mightora-ad>`;
writeFileSync(
  "dist/demo/index.html",
  shell("Overview", home, {
    quick:
      '<a href="#overview">Overview</a><a href="#examples">Demonstrations</a><a href="#sizes">Banner sizes</a><a href="#integrate">Integration</a>',
  }),
);
const editorHTML = readFileSync("demo/editor.html", "utf8");
const quick =
  '<a href="#workspace">Workspace</a><a href="#campaign">Campaign</a><a href="#controls">Controls</a><a href="#preview">Preview</a><a href="#publish">Publish</a><a href="#network">Network</a>';
writeFileSync(
  "dist/demo/editor.html",
  shell("Campaign editor", editorHTML, { editor: true, quick }),
);
writeFileSync(
  "dist/downloads/mightora-shared-ads-offline.html",
  shell("Offline campaign editor", editorHTML, {
    editor: true,
    offline: true,
    quick,
  }),
);
const topics = [
  [
    "Make space for the task",
    "Useful interfaces let people focus on the work they came to do. A promotion should sit at a deliberate boundary after useful information, with enough space around it to keep navigation and controls clear. The simplest starting point is one compact banner near the end of a page.",
  ],
  [
    "Choose a useful message",
    "A house campaign can invite people to share feedback, visit a blog or explore another tool. It uses a static image and an ordinary link. It needs no visitor identifiers, advertising cookies, tracking pixels or click redirects. Selection happens locally and forgets its choices when the page closes.",
  ],
  [
    "Let layout guide delivery",
    "A compact mobile placement can use a 320 by 50 image. Wider screens can use a 468 by 60 or 728 by 90 image. The component checks the available width and approved sizes before selecting an advert. If nothing fits, it keeps the space empty instead of making the page scroll sideways.",
  ],
  [
    "Keep decisions with the owner",
    "A central configuration lists approved domains, placement names and campaign dates. The website still decides where a component is inserted. Neither loading a script nor approving a campaign creates a new advertising location. The header, author biography and footer remain separate shared components.",
  ],
  [
    "Make privacy choices meaningful",
    "Refusing Google advertising does not stop people using the site. When a reviewed house campaign is available it may fill the placement without contacting Google. Google advertising uses a separately configured certified consent provider. The demo does not load a Google advertising script or make real ad requests.",
  ],
  [
    "Review before publishing",
    "The visual editor changes an in-memory draft. Exported files go through an authenticated GitHub pull request. Validation checks dates, URLs, image dimensions and domain approvals before deployment. A global kill switch lets the owner remove advertising from every connected placement after the next configuration check.",
  ],
];
const article = topics
  .map(
    ([h, p], i) =>
      `<section id="part-${i + 1}"><span class="eyebrow">0${i + 1} / DESIGN NOTE</span><h2>${h}</h2>${Array.from({ length: 3 }, () => `<p>${p}</p>`).join("")}${i === 2 ? '<mightora-ad placement="article-middle"></mightora-ad>' : ""}</section>`,
  )
  .join("");
writeFileSync(
  "dist/demo/article.html",
  shell(
    "A quieter approach to useful messages",
    `<article class="article"><span class="eyebrow">MIGHTORA FIELD NOTES · DEMONSTRATION</span><h1>A quieter approach to useful messages.</h1><p class="lead">An example of a long, content-rich page with two explicitly approved advertising placements.</p>${article}<mightora-ad placement="content-bottom"></mightora-ad></article>`,
  ),
);
for (const kind of ["landing", "mobile", "disabled", "refused", "tool"]) {
  const title = {
    landing: "A useful landing page",
    mobile: "A compact mobile layout",
    disabled: "Advertising is disabled",
    refused: "Google consent has been refused",
    tool: "A small developer tool",
  }[kind];
  const content = `<section class="hero"><div><span class="eyebrow">MIGHTORA / ${kind.toUpperCase()} DEMO</span><h1>${title}.</h1><p class="lead">${kind === "refused" ? "This is an illustrative refused state. No CMP or Google advertising is loaded. Only cookie-free house messages are eligible." : kind === "disabled" ? "The application remains useful. The advertising runtime is locally disabled before it can request configuration." : "A simple page that keeps useful content, controls and advertising in their own deliberate places."}</p><a class="button" href="./">Back to overview</a></div></section>${kind === "tool" ? '<section data-ad-free class="tool-area"><h2>Text counter</h2><label for="tool-input">Paste or type text</label><textarea id="tool-input" rows="5"></textarea><p id="tool-output" role="status">0 characters. Processed locally.</p></section>' : ""}<section class="section"><h2>Useful content comes first.</h2><p>Advertising does not cover content, float over the page or sit inside this tool. The approved banner appears below this section with clear separation.</p></section><mightora-ad placement="content-bottom"></mightora-ad><p class="tiny">${kind === "disabled" ? "No advertising requests are permitted on this page." : "House messages use ordinary links. No advertising cookies, storage or click telemetry."}</p>`;
  writeFileSync(
    `dist/demo/${kind}.html`,
    shell(title, content, { ads: kind !== "disabled" }),
  );
}
writeFileSync(
  "dist/demo/privacy.html",
  shell(
    "Privacy and network information",
    `<article class="article"><h1>Privacy and network information</h1><p>This demo uses cookie-free house messages. No advertising cookies, browser storage, visitor profiles, click tracking or measurement are implemented. House messages link directly to feedback, the blog or another tool.</p><p>The online page loads the Mightora shared components, stylesheet, logo and footer resources. The shared header independently stores its theme choice; it is separate from advertising. GitHub Pages and asset hosts receive normal web requests including IP addresses. Ad selection reads available layout width and uses page-memory campaign IDs to avoid duplicates; it creates no persistent identifier.</p><p>Google advertising is disabled in this demo. An opted-in participating site must install a certified CMP, keep privacy preferences accessible and publish its own current privacy and cookies information before enabling Google.</p><p>Press F12, choose Network, enable Preserve log and reload to inspect requests. Inspect browser storage separately. The offline editor includes a restrictive CSP and makes no application network requests. Outbound links work only if you deliberately follow them.</p><p>These implementation notes are not a legal certification. Review the privacy guide and current applicable rules before adding advertising to a site.</p><a href="./">Back to overview</a></article>`,
    { ads: false },
  ),
);
const guide = `<article class="article"><span class="eyebrow">INTEGRATION GUIDE</span><h1>Opt in one website at a time.</h1><p>Start with a cookie-free house message. Register the exact domain, approve its placements and add the component at a content boundary. Existing Mightora headers, author sections and footers are untouched.</p><pre class="code">&lt;script defer src="https://mightora.github.io/shared-ads/releases/${pkg.version}/mightora-ads.js"
  data-enabled="true" data-site="YOUR-SITE-ID"
  data-domains="YOUR-EXACT-DOMAIN"
  data-config="https://mightora.github.io/shared-ads/config/config.json"&gt;&lt;/script&gt;

&lt;mightora-ad placement="content-bottom"&gt;&lt;/mightora-ad&gt;</pre><h2>One small configuration change.</h2><p>Use the campaign editor to review domain approvals and create image campaigns. Export the draft to a GitHub pull request. CI validates the configuration and static image assets. The Pages deployment publishes the updated configuration without rebuilding participating sites.</p><h2>Google needs separate setup.</h2><p>No Google account or live unit is bundled. Use official manual display units, keep Auto Ads and size optimisation disabled, obtain site approval and install a Google-certified CMP with current TCF support. The implementation uses a conservative consent-only gate and never substitutes Google limited ads after refusal.</p><h2>Disable whenever needed.</h2><p>Set data-ads="off" on the HTML element, leave out the runtime, or set offline mode for downloadable tools. The central global kill switch removes advertising after the next successful check. A failed check clears all placements.</p><h2>Detailed guides</h2><ul>${[
  ["integration", "Installing the component"],
  ["google-adsense", "Google setup and Auto Ads"],
  ["consent", "Certified CMP integration"],
  ["privacy", "Privacy review and source register"],
  ["campaigns", "Campaigns and rotation"],
  ["deployment", "GitHub Pages deployment"],
  ["security", "Security and testing"],
]
  .map(
    ([f, t]) =>
      `<li><a href="https://github.com/mightora/shared-ads/blob/main/docs/${f}.md">${t} ↗</a></li>`,
  )
  .join(
    "",
  )}</ul><p><a href="../downloads/mightora-shared-ads-offline.html" download>Download offline editor HTML</a> · <a href="../downloads/mightora-shared-ads-offline.zip" download>Download offline editor ZIP</a></p></article>`;
writeFileSync(
  "dist/demo/guide.html",
  shell("Integration", guide, { ads: false }),
);
writeFileSync(
  "dist/index.html",
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=demo/"><title>Mightora Shared Ads</title></head><body><a href="demo/">Open Mightora Shared Ads</a></body></html>',
);
writeFileSync("dist/.nojekyll", "");
if (existsSync("docs")) cpSync("docs", "dist/docs", { recursive: true });
if (existsSync("LICENSE")) cpSync("LICENSE", "dist/LICENSE");
if (existsSync("THIRD_PARTY_NOTICES.txt"))
  cpSync("THIRD_PARTY_NOTICES.txt", "dist/THIRD_PARTY_NOTICES.txt");
const instructions =
  "Mightora Shared Ads — Offline campaign editor\n\nDouble-click index.html. No installation, server or internet connection is needed. Import a checked-out config.json or edit the bundled draft; export validated configuration for review through GitHub. Advertising and remote loading are disabled. No GitHub credentials are used. Changes are held in page memory until exported.\n";
const offlineFiles = {
  "index.html": readFileSync("dist/downloads/mightora-shared-ads-offline.html"),
  "README.txt": strToU8(instructions),
  LICENSE: readFileSync("LICENSE"),
  "THIRD_PARTY_NOTICES.txt": readFileSync("THIRD_PARTY_NOTICES.txt"),
};
writeFileSync(
  "dist/downloads/mightora-shared-ads-offline.zip",
  zipSync(offlineFiles),
);
writeFileSync(
  "dist/manifest.json",
  JSON.stringify(
    {
      version: pkg.version,
      configurationRevision: cfg.revision,
      runtimeBytes: runtime.length,
      runtimeGzipBytes: gz,
      runtimeIntegrity:
        "sha384-" + createHash("sha384").update(runtime).digest("base64"),
      offlineSha256: createHash("sha256")
        .update(offlineFiles["index.html"])
        .digest("hex"),
    },
    null,
    2,
  ),
);
console.log(
  `Built ${pkg.version}: runtime ${runtime.length} bytes / ${gz} gzip bytes; offline editor and demo ready`,
);
