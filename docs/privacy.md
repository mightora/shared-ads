# Privacy review and policy guidance

Reviewed against the official sources below on 19 October 2026. This is an engineering implementation and review record, not legal advice or a certification. Recheck the current rules, audience and CMP before enabling a domain. The house messages are intended for feedback requests, the blog and other tools, without cookies or tracking.

## House message processing

The runtime has no advertising cookies, localStorage, sessionStorage, persistent IDs, fingerprinting, tracking pixels, third-party ad scripts, impression analytics, click telemetry or redirects. It reads the current hostname/path, available container width, CSS viewport width, time and main-content word count to apply owner rules. It selects randomly and remembers only current-page campaign IDs in memory, to avoid duplicate messages. It fetches configuration and static artwork with credentials omitted, referrer omitted and redirects rejected. Artwork is rendered through a temporary local blob URL. Links are direct anchors with no click handler, no tracking query string, and noreferrer. No aggregate performance feature is included.

Ordinary hosting requests still disclose network data (e.g. IP address, user agent and request path) to GitHub Pages/CDN infrastructure. The image/JSON host may retain normal security/hosting logs under its policies; the platform does not export or correlate them. Browser HTTP caching is used without an advertising identifier. An ordinary destination may have its own privacy practices after a user follows the link. Review it before approving a campaign. The page's existing analytics and shared header theme setting are independent: the shared UI header reads/stores its theme in localStorage, while the advertising runtime never does. Don't claim the whole online website is cookie-free just because the house provider is.

The ICO's current SAT guidance says consent applies to storage/access technologies used for advertising, including selection/delivery and measurement. Absence of cookies alone is not a universal exemption. Review the actual use of device/layout information and hosting data, the purpose and audience, any applicable PECR exceptions and UK GDPR lawful basis/transparency. The houseAdsApproved flag is an explicit owner approval of the reviewed cookie-free use case; it does not itself determine legal status. Keep the implementation limited to simple static, contextual community promotions and do not add measurement or identifiers under that approval.

## Third parties and notices

| Feature | Recipient | What is sent / responsibility |
| --- | --- | --- |
| Shared runtime, config, artwork | GitHub Pages/CDN | Normal resource request metadata; config/artwork fetches omit credentials/referrer. |
| Online Mightora shell | jsDelivr, GitHub-hosted brand resources | Shared CSS/components/logo/footer resource requests; independently used branding. |
| Google (only after all gates) | Google and applicable disclosed ad technology partners | Advertising requests and provider-defined data/cookies after the CMP permissions. Review the actual provider/vendor list and retention/transfers. |
| Certified CMP (owner selected) | Selected CMP/vendor | Consent UI, records and preference persistence under its own documented integration. |
| Chosen ordinary destination | Destination operator after navigation | User deliberately follows a direct link; destination's notice applies. |

The central house-only demo does not load Google or a CMP. Its privacy page discloses the online branding dependencies. The offline editor embeds all assets and code, has connect-src none/frame-src none, and makes no application network requests. Outbound links can be followed deliberately. Its Resource Timing view is partial; F12 → Network → Preserve log → reload is the independent inspection method.

For each enabled domain, update privacy/cookies information to identify the operator and contact route; purposes, data, recipients, retention/transfers and lawful bases; which advertising providers/CMP are used; refusal/withdrawal, user rights and complaint route; cookie categories and actual provider lifetimes; direct-link/hosting behaviour; whether any analytics is independently enabled. Use the CMP's actual inventory, not a copied generic list. Don't imply non-personalised or limited Google ads are exempt from consent.

## Children

All heroacademy.app and heroacadmey.app subdomains, their apexes, and known /hero-academy-* project paths on github.io are blocked before remote configuration is fetched. Every site marked child-directed is denied. Configuration validation rejects enabling such a site, and no age-treatment bypass is included. Register additional child-directed custom domains accurately; the runtime cannot discover an unlabelled audience. Hero Academy and related learning games are not opted in.

Future child-directed advertising would require a separate design and privacy/child-safety review, a DPIA where appropriate, then-current Google age-treatment requirements and applicable UK Children’s Code and COPPA duties. Never profile children or disguise a promotion as a game reward. The current runtime intentionally provides no switch to override this exclusion.

COPPA scope includes child-directed services collecting personal information from US under-13s, and certain general-audience services with actual knowledge. The amended rules impose separate verifiable parental consent for certain third-party disclosures, including targeted advertising, alongside notice, security and retention duties. Do not assume a TCF banner meets COPPA parental-consent requirements. The exclusion avoids introducing that advertising collection into Hero Academy.

## Official source register

- ICO SAT guidance (finalised 29 April 2026): https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/
- ICO advertising-specific guidance: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-the-rules-apply-to-online-advertising/
- ICO UK GDPR / PECR relationship: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-the-pecr-rules-relate-to-the-uk-gdpr/
- ICO Children’s Code standards: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/
- FTC COPPA FAQ: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- FTC COPPA compliance plan: https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-six-step-compliance-plan-your-business
- Google EU User Consent Policy: https://www.google.com/about/company/user-consent-policy/
- Google publisher policies, placements, AdSense policy and CMP/TCF requirements: see google-adsense.md.

These sources can change. Owner/legal review remains required for a particular site and audience, including non-UK visitors; the implementation applies its conservative gate globally rather than geolocating visitors.

Additional source for the amended COPPA requirements: https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data
