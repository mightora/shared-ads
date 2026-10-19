# Verification record — 19 October 2026

Executed locally against this delivery:

| Check | Result |
| --- | --- |
| TypeScript strict checking | Passed. |
| JSON Schema / semantic configuration validation | Passed: 4 registered sites and 4 sample campaigns. |
| Static artwork validation | Passed: 20 variants across the five allowed sizes. |
| JavaScript unit tests | 87 passed. |
| Python artwork safety tests | 2 passed (including multiple unsafe SVG payloads). |
| Chromium browser tests | 33 passed, no skips. |
| Equal and weighted distributions | 100,000 simulated selections per mode passed distribution bounds. |
| Mock Google / consent races | Passed; no live Google impressions or clicks. |
| House storage / cookie behaviour | Passed persistent-storage access traps; existing cookies omitted from JSON/artwork requests. |
| Responsive layouts | Passed at 300, 320, 375, 768 and 1440 CSS pixels; insufficient space remains empty. |
| Accessibility | Keyboard focus checks and no serious/critical axe WCAG A/AA violations on landing/editor in light and dark themes. Manual visual inspection also completed. |
| Offline editor | Opened directly with file:, 0 HTTP requests; ZIP index.html byte-matches direct HTML. |
| Dependency audit | npm audit reported 0 known vulnerabilities. |
| Runtime size | 128,400 bytes uncompressed; 17,597 bytes gzip. No remote runtime dependencies. |

The local browser run used Chromium 153 via an explicit executable path because the execution environment's standard Playwright browser download was unavailable. The committed tests also support the normal Playwright installation used by GitHub Actions. All test requests are intercepted or blocked, including Google; external CMP/account/site approval and actual ad inventory are not simulated as production services.

Repository-hosted CI, CodeQL and Pages results are recorded by their real GitHub workflows after push. A local passing result is not described as a completed remote scan or a legal certification. Follow the deployment checklist before opting additional websites in. Google remains disabled in the shipped configuration; Hero Academy remains excluded.
