# Acceptance evidence

The central implementation is reviewable and does not opt in other websites. Local checks and GitHub-hosted checks are distinct. See VERIFICATION.md for the executed test results in this delivery; workflow badges become evidence only when GitHub has actually run them.

| Requirement | Implementation / verification |
| --- | --- |
| Static image successfully rendered | House provider, browser house test and demo. |
| Explicit placements only | Component API, ancestor checks, no auto insertion, domain/path rules. |
| No Auto Ads | Only manual ins and push; account console confirmation mandatory, external check. |
| Google manual integration | Async provider, fixed/optional responsive units, all tests mocked/blocked. |
| House/Google/none | Eligibility/selection, owner modes, consent and failure tests. |
| Central updates without site rebuilds | JSON fetched separately from pinned runtime, revalidation/kill test. |
| Domain / children exclusions | Exact domain/path approvals, local gate, child classification and family block. |
| Consent refusal/withdrawal | Certified TCF listener, async recheck/cancellation and document-unload contract. |
| Cookie-free house campaigns | Omitted fetch credentials, no storage/IDs/telemetry; browser storage access trap. |
| Offline requests | Explicit offline/file mode and self-contained editor, direct-file browser test. |
| CI/security | Local check/audit; real Actions/CodeQL/dependency review workflows supplied. Actual GitHub execution requires repository access. |
| Mobile/accessibility | 300/320/375/768/1440 width, focus, navigation offsets and automated axe tests. |
| Branding | Official shared components, author fallback, evidence immediately above footer. |
| Deployment | Pages workflow and deployment guide; remote publication requires accessible repository. |
| Randomness/diversity | 100,000 draws per mode, normalisation/duplicate tests, no visitor persistence. |
| Offline downloads match | ZIP/index.html byte comparison against direct HTML. |

External release prerequisites: accessible GitHub repository, Pages enabled, first actual CI/CodeQL/deployment runs, owner inspection of the published site; for Google, account/units/site approval, Auto Ads off, certified CMP/privacy setup and valid per-domain ads.txt. No DNS change is required for the default GitHub Pages project URL. No legal certification is claimed.
