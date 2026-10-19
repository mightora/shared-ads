# Installing the shared component

1. Register an exact hostname and a unique site ID in `config/sites.json`. `www` and the apex are separate registrations. A GitHub Pages project can be restricted with `pathPrefixes: ["/your-repository/"]`; this never authorises sibling repositories.
2. Set `audience: "general"`, deliberately enable the site, approve house messages with `houseAdsApproved`, choose categories, maximum count, approved sizes and placement settings. Leave Google disabled until separately configured. The approval flag records the owner's review; the software does not certify legality.
3. Approve the site ID, category and placement on each campaign. Review direct destinations and static artwork.
4. Load the pinned script from the README. `data-enabled="true"`, the exact `data-domains`, site ID and HTTPS configuration URL are all required. `data-domains` is an independent local gate, not a wildcard.
5. Insert `<mightora-ad placement="content-bottom"></mightora-ad>` near the end of main content. No component is ever inserted by the platform. Missing, invalid or insufficient-width placements stay empty.

Supported names: content-bottom, article-middle, sidebar, landing-secondary, footer-above-author. Default to one placement. A second needs an approved `longContentPaths` rule and at least 800 words in `<main>`, plus global and site maximums of two. A placement name appears at most once per page. Article-middle also requires that long-page approval. Campaign/Google unit weights apply to one advert, not one image variant.

Keep adverts at least 40px from navigation, buttons and downloads, and more where the actual layout requires. Review desktop and mobile proximity. Never put them inside a form, editor, application canvas, educational question/answer sequence, sticky/floating container, header, author or footer. Runtime checks catch known forbidden ancestors, but cannot infer every dangerous visual placement. Use `data-ad-free` on protected areas. A footer-above-author placement belongs outside the shared author/footer components, after main content. The ad's own styling is scoped in a shadow root; standard Google elements use light DOM so the official script can discover them.

## Module/API use

```js
import {start} from 'https://mightora.github.io/shared-ads/releases/1.0.0/mightora-ads.mjs';
const runtime = await start({
  enabled: true,
  siteId: 'your-site-id',
  allowedHosts: ['your.exact-domain.example'],
  configUrl: 'https://mightora.github.io/shared-ads/config/config.json',
  offline: false
});
// After your router changes the URL:
runtime.notifyNavigation();
// Stop and clear advertising:
runtime.stop();
```

The pinned runtime remains unchanged while central configuration updates. `v1/` is a moving convenience build; use the versioned release plus the generated SHA-384 integrity in manifest.json if pinning with SRI. Hosts need `crossorigin="anonymous"` for cross-origin SRI. Do not pin a changing alias to an old hash.

## Disable and offline

- Global: enabled false, mode off, or killSwitch true.
- Site: enabled false, mode off, or maxAdsPerPage 0.
- Page before startup: `<html data-ads="off">` or `<meta name="mightora-ads" content="off">`.
- Placement: disabled attribute or placement.enabled false.
- Offline: omit the script entirely; optionally bundle the runtime with `offline: true` or set `<html data-offline="true">`. file: automatically blocks it. Offline mode never requests configuration, house images or Google.

Stopping after a Google loader has executed triggers a page reload by default. See the withdrawal contract in consent.md. To guarantee zero advertising requests on a disabled site, do not include the remote runtime, or bundle it and disable before startup. The online demo's independent shared UI resources are not advertising requests.

## CSP

House-only sites need script-src for the selected runtime origin, connect-src for the configuration/artwork origin, img-src blob:, and the owner's normal style policy. The component uses inline scoped CSS and inline dimensional styles; permit styles accordingly or adapt deployment with your CSP review. GitHub Pages supplies CORS for public resources; any replacement central host must permit anonymous CORS. Redirecting configuration or artwork is rejected.

Google/CMP CSP allowlists depend on the provider's current documentation. Do not copy the intentionally restrictive house-only demo CSP into a Google-enabled site: it blocks advertising scripts and frames. Keep your existing Mightora header, author and footer integrations.
