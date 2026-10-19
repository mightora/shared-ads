# Security and quality

Runtime code uses strict JSON Schema and semantic validation, exact host/origin matching, safe URL construction and DOM textContent/property assignment. It accepts no untrusted HTML. Its approved static artwork is checked for dimensions, size and executable SVG/animation. Configuration and artwork fetches omit credentials and referrer and reject redirects. All house links are direct HTTPS destinations with sponsored/noopener/noreferrer. No PAT or administration credential is requested, stored or embedded.

Configuration is trusted owner-managed public data, not a place for secrets. A compromised authorised repository can change campaigns or links; protect it with branch rules, reviews, minimal permissions, 2FA and workflow security. Loading remote JavaScript is a supply-chain boundary; pin the runtime release and optionally the generated integrity hash. Shared UI @main is prescribed by Mightora's design system and changes independently; this dependency is separate from the advertising runtime. The build snapshots the footer and normalises its YAML to JSON accepted by js-yaml, so a new page needs no global fetch monkey-patch. Existing consuming-site footer workarounds are untouched.

The browser runtime has no third-party runtime dependencies. The build bundles the standalone schema validator and provider code. Compiler, validator generation, test tools, ZIP generation and the branded editor's YAML parser are development/build dependencies locked by npm. The demo loads the official shared CSS and components from jsDelivr; the advertising component never replaces them.

Tests cover schema/semantic rejection, URL and XSS cases, exact domains, page approvals, date boundaries, sizes, campaign diversity, statistical equal/weighted distributions, max counts, consent refusal/withdrawal/races, Google mocks, broken assets, kill switch, offline requests, keyboard focus and responsive layouts. Automated axe checks are a useful accessibility check, not full accessibility certification. Browser tests intercept every advertising/network request and cannot create real Google impressions. Tests use frozen fixtures and explicit mocks for consent; never deploy those mock TC strings as a CMP.

Run npm test, npm run build, npm run test:browser, npm run audit. GitHub workflows additionally run CodeQL and dependency review/Dependabot. CI status is only known after the actual workflow runs. A zero-advisory audit or passing scan does not prove the absence of vulnerabilities.

## Fail-safe boundaries

- Local disable/offline/child domain checks precede remote configuration.
- Unconfigured or mismatched sites never render, even if a component exists.
- Invalid, missing, oversized, redirected or timed-out configuration cannot authorise an advert.
- House fetch/image errors use reviewed house alternatives or empty, never a tracking provider.
- Consent is checked again after asynchronous Google loading. Settled withdrawal blocks new requests, removes units, and reloads a document that loaded Google (see consent.md).
- The central platform cannot retroactively stop another independently installed advertising script or infer the intent of every placement. Review the host integration and do not add competing loaders.

Report security issues privately through the repository's GitHub security advisory facility once enabled. Do not post secrets or sensitive visitor information in a public issue.
