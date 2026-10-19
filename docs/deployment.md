# GitHub Pages deployment and rollout

The source targets https://github.com/mightora/shared-ads and the standard project URL https://mightora.github.io/shared-ads/. A backend, database, paid service and Cloudflare Worker are not required. No other Mightora tool is changed.

## Checklist

- Create the public repository and push this source to main; use an authenticated GitHub account with permission. Do not upload node_modules, browser binaries, dist or secrets.
- Run npm ci; npm test; npm run build; install Playwright Chromium; run npm run test:browser; run npm run audit.
- In Settings → Pages, choose GitHub Actions as the publishing source. The pages.yml workflow checks source, dependencies and browser behaviour before deploying. It needs pages:write and id-token:write only in its deployment job.
- Enable CodeQL and dependency review availability for the public repository. Set branch rules to require CI and CodeQL, PR review and no direct changes to production configuration. Configure CODEOWNERS if desired; do not assume the template already protects the branch.
- Allow the first Pages deployment to finish. Verify the demo, editor, guide, config/config.json, config/schema-v1.json, manifest.json, offline HTML/ZIP and versioned runtime are accessible. Check that GitHub Pages sends the appropriate public CORS response for JSON and images.
- Check images at mobile widths, sticky navigation/hamburger, author and footer, and the evidence links. CodeQL is a repository security check; no local substitute is described as a passing CodeQL run.
- Opt in one general-audience site after its placement and privacy review. Register its exact domain in central configuration AND its local allowedHosts/data-domains. Hero Academy remains excluded.
- Only after separate account/CMP/site approval setup, enable Google on an appropriate domain. Publish and check that domain's ads.txt. Do not generate automated live impressions.

The default Pages address needs no DNS change. A custom central domain is optional; only configure it after ownership and DNS are available. Update the base URL, approved artwork origins, schema ID/documentation and the asset-check origin rule deliberately; add a CNAME through the normal Pages process. Do not change hosting platform.

## Central changes and rollback

Commit the three config inputs with matching schemaVersion and revision. Each revision should be unique. Validation compiles the JSON schema, checks semantic references and validates all artwork. The build publishes the aggregate and a versioned config snapshot. A full-history checkout preserves up to 30 historical config commits as versioned files in the Pages build, as well as committed config/versions snapshots. Retain important snapshots in config/versions if older than that window.

Roll back with a reviewed git revert of the relevant config commit (or restore the three prior files with a new revision). Rebuild Pages; participating sites keep their existing runtime script. Runtime revisions are separately pinned under releases/<version>/; increase package.json version for changes to the runtime. Rebuilds retain the currently packaged runtime release; consumers requiring a historical runtime should self-host their pinned release or retrieve it from its Git tag. Tag releases in GitHub rather than claiming all old Pages release paths remain forever.

Active opted-in pages poll at the shorter of cacheSeconds and 60 seconds, with a 30-second query bucket and no-store. They also revalidate on becoming visible. Failed/invalid responses remove placements rather than use stale configuration. No Google impression is refreshed by this process. Publication/hosting caches and background-tab timer throttling mean the kill switch isn't instantaneous: expect Actions/Pages publication time plus the next active-tab check. After a site/global disable is discovered polling stops; a later re-enable takes effect on a fresh page load or explicit refresh. Local data-ads off is the immediate owner-controlled stop.

The offline HTML and ZIP are generated from src/editor.ts, the current bundled configuration and embedded artwork. ZIP/index.html must byte-match the direct HTML; the browser test checks this, opens file: directly and records zero HTTP requests. Offline users can import a newer checked-out config.json; “Review published configuration” remains disabled.
