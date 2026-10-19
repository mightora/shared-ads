# House campaigns and selection

Use cookie-free messages for feedback, the TechTweedie blog, another tool or a clearly disclosed paid promotion. Each campaign has ID, name, description, static variants, accessible alt, direct destination, inclusive start and exclusive end (UTC), enabled flag, site IDs, approved placements, category, disclosure, viewport range and a non-negative weight. A zero weight pauses selection. No impression or click measurement is implemented.

Primary dimensions: 320×50, 468×60 and 728×90. Optional: 320×100 and 300×250. All three levels (global, site and placement) must allow a size. The widest matching variant that fits the container is used; images are never stretched. The production runtime doesn't scale a wide campaign into an unapproved smaller unit. Screen ranges use CSS viewport width only, never device fingerprint data.

- Equal: every positive-weight, currently eligible advert gets one equally likely entry.
- Weighted: probability is weight / total positive eligible weights. 50,30,20 means 50%,30%,20% only when all three remain eligible. With the last absent, the first two become 62.5%,37.5%.
- Mixed: approved, consented Google units join the same pool as house campaigns.
- House-only: Google is never loaded.
- Google-only: Google is preferred when fully permitted. With refused/pending/withdrawn consent, reviewed house messages can still be used if fallback=house; otherwise empty. This is deliberate, and never sends a refused request to another provider.
- Off: no candidates.

All approval, dates, category, location, size and consent filters run before selection. Page-memory IDs avoid selecting the same campaign twice where alternatives remain. There is no history across page loads, frequency cap, cross-tab identity or persistent storage. Math.random is used for anonymous selection; this isn't a cryptographic lottery.

A served Google unit is not refreshed on a timer, resize, consent grant or configuration refresh. A failed/blocked/unfilled unit may use one of the eligible house alternatives; it never tries another Google unit. A broken house image can try another eligible house campaign, then leave empty. A house asset fetch omits credentials and referrer and rejects redirects. Blob image URLs are temporary and revoked; links have sponsored/noopener/noreferrer and no click listener.

## Editor and PRs

The static editor is a local draft tool, not an authenticated admin service. Drafts exist only in memory and unsaved work is lost on reload. Import config.json to resume, save changes to the draft, preview bundled image sizes and export. The blog sample starts disabled. Advanced JSON supports all site/provider settings. Change the revision consistently using the export field.

“Export change for pull request” produces config/global.json, sites.json and campaigns.json. Upload those three files to config/ in an authenticated GitHub session and choose a new branch and pull request. Branch rules should require CI and owner review. The central workflow builds the aggregate after merge. Images must also be committed to public/adverts. New remote images are not fetched automatically by the editor; bundled artwork previews are embedded. Use the local artwork input to preview your own static images without network requests. It validates file size, dimensions and SVG safety; filenames must match the campaign variant URLs. Referenced selected images are included under public/adverts in the exported change ZIP. CI independently validates their committed bytes.

## Artwork and URLs

Commit static WebP, PNG, JPEG or an SVG that passes scripts/check-assets.py. SVG's allowlist excludes scripts, event handlers, foreignObject, links, external references, stylesheets and animation. PNG/APNG and WebP animation are rejected. Artwork is limited to 150 KB per variant; prefer far smaller. The supplied SVGs are a few hundred bytes, built from basic shapes and text. Do not embed invisible measurement pixels.

Destinations and images must use approved exact HTTPS origins, no credentials, nonstandard ports, query strings or fragments. This intentionally disallows tracking parameters. Common click/redirect paths are rejected. Review the final destination, including whether the destination itself performs tracking; a direct anchor is not a guarantee about a third-party site. CI checks artwork against this repository's central origin. If adopting a custom central domain, deliberately update the origin rule in the asset checker and the configuration.

Keep existing versioned artwork filenames immutable. When updating an image, use a new filename and change the campaign variant URL so normal browser caching cannot retain an older creative under the same URL.
