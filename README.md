# Mightora Shared Ads

Small, deliberately positioned advertising for static websites. Cookie-free house messages can ask for feedback, promote the TechTweedie blog or introduce another Mightora tool. Google AdSense is a separate, disabled-by-default provider behind site approval and a certified-CMP consent gate.

[![CI](https://github.com/mightora/shared-ads/actions/workflows/ci.yml/badge.svg)](https://github.com/mightora/shared-ads/actions/workflows/ci.yml)
[![CodeQL](https://github.com/mightora/shared-ads/actions/workflows/codeql.yml/badge.svg)](https://github.com/mightora/shared-ads/actions/workflows/codeql.yml)
[![Pages](https://github.com/mightora/shared-ads/actions/workflows/pages.yml/badge.svg)](https://github.com/mightora/shared-ads/actions/workflows/pages.yml)
[![MIT](https://img.shields.io/badge/licence-MIT-green)](LICENSE)
[Source](https://github.com/mightora/shared-ads)

Workflow badges report real GitHub results once this repository is published; they are not security certifications. The demo links directly to the evidence without asserting a passing status.

## Run

Requires Node 24+, npm and Python 3 (standard library only).

```sh
npm ci
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:browser
npm run audit
npm run serve
```

Open `http://127.0.0.1:4173/demo/`. The browser tests intercept all advertising requests; no live Google impressions or clicks are generated. Local development uses the same validated configuration with explicitly local image copies. Production assets require HTTPS.

## What is included

- Dependency-free browser runtime, IIFE and ES module builds; compiled JSON Schema validation with additional semantic checks.
- Explicit `<mightora-ad>` placements, exact domain/path approval, page/placement exclusions, global kill switch and maximum one advert per ordinary page.
- Equal random or automatically normalised weighted selection after eligibility filtering; page-memory campaign diversity.
- Static house campaigns with no advertising cookies, local/session storage, identifiers, profiling, pixels, click handlers or measurement. Artwork is fetched with credentials omitted; destinations are direct ordinary links.
- Manual AdSense unit provider with asynchronous loading, visibility gating, consent rechecks, cancellation and house/empty fallback. No Auto Ads configuration is issued.
- A visual editor with preview, import/export, expiry status, owner controls and an authenticated GitHub pull-request publishing process. No frontend credentials or write API.
- Six demo layouts, primary-size previews, shared Mightora components, sticky navigation, author section and evidence badges immediately above the shared footer.
- A fully embedded offline campaign editor, downloadable HTML and ZIP, generated from the same source. Downloadable tools have an explicit no-advertising mode.

## Integrate a site

Register the domain in `config/sites.json`, approve campaigns for its site ID, review the placement, then add:

```html
<script
  defer
  src="https://mightora.github.io/shared-ads/releases/1.0.0/mightora-ads.js"
  data-enabled="true"
  data-site="your-site-id"
  data-domains="your.exact-domain.example"
  data-config="https://mightora.github.io/shared-ads/config/config.json"
></script>

<!-- Deliberately placed near the end of main content, away from controls -->
<mightora-ad placement="content-bottom"></mightora-ad>
```

Script inclusion alone does nothing. Both the local host allowlist and central site configuration must approve the site. No other Mightora website is modified or opted in by this project. Hero Academy domains and child-directed configurations are blocked.

See [integration](docs/integration.md), [campaigns](docs/campaigns.md), [Google](docs/google-adsense.md), [consent](docs/consent.md), [privacy/source register](docs/privacy.md), [deployment](docs/deployment.md), [security](docs/security.md) and [acceptance evidence](docs/acceptance.md).

## Source of truth and publishing

Edit `config/global.json`, `sites.json` and `campaigns.json`, with the same `schemaVersion: 1` and unique `revision`. `npm run config:validate` generates the aggregate and validates artwork. The visual editor exports these three inputs. Submit them through a reviewed GitHub PR; Pages publishes `config/config.json` separately from the runtime version, so participating sites do not need a rebuild.

Active pages check at most every 60 seconds with a 30-second cache-busting bucket, `cache: no-store`, credentials omitted and no referrer. Configuration failure removes adverts. Allow for GitHub Actions/Pages publication and CDN propagation; this is not an instantaneous guaranteed shutdown. A locally disabled site makes no runtime-owned advertising request. An explicitly opted-in site must make one initial configuration request to discover a central disablement. Use the local disable switch for zero initial advertising requests.

## External setup still required

Publishing requires access to `mightora/shared-ads` and GitHub Pages set to GitHub Actions. Google requires an AdSense account, approved domains, real manual unit IDs, Auto Ads disabled in the console, current certified-CMP configuration, applicable consent and per-domain ads.txt. No account, approval, legal certification, DNS setup or live advertising credentials are bundled. The shipped configuration enables house messages only on the central demo and loopback preview hosts; the blog sample is initially disabled.
