# Manual Google AdSense integration

Google is implemented but disabled in the shipped configuration. No live IDs are supplied, and tests always mock/block Google. Central registration does not approve a site for AdSense. Each participating site must satisfy Google's approval, content, inventory and placement requirements independently.

1. Obtain an AdSense account and approval for the actual participating domain.
2. In AdSense, open Ads → By site → Edit for the site. Switch Auto ads OFF and apply/save the change. Check every participating site. Remove any other automatic ad integration from the host page. Recheck the current console instructions if its UI changes.
3. Disable ad size optimisation, mobile size optimisation and other automatic format/placement experiments that could expand units beyond the deliberately approved space. Use the current official console guidance.
4. Create a manual Display ad unit (Ads → By ad unit → Display ads). Prefer a fixed 320×50, 468×60 or 728×90 unit. These are within Google's fixed-unit dimensional limits, but narrow units may have limited inventory. Google can serve text or rich media; house-creative appearance is not guaranteed.
5. Put the actual ca-pub ID in global.google.publisherId. Confirm Auto Ads disabled only after checking it. Configure the certified CMP IDs and install the CMP independently, with TCF support current at launch (Google's March 2026 notice requires TCF 2.3 and a disclosed-vendors segment including Google).
6. On the site set googleApproved and googleEnabled true, and configure a googleUnits entry for each known placement, with its real slot ID, dates, weight, approved size and format. Enable Google globally and choose mixed/google-only. Keep house fallbacks configured.
7. Publish the domain's ads.txt and run the live check. Review its privacy notice and persistent consent-preferences control before enabling.

A unit uses the official async loader with ca-pub query and crossOrigin=anonymous, followed by an ins.adsbygoogle with data-ad-client, data-ad-slot, explicit fixed dimensions and adsbygoogle.push({}). No enable_page_level_ads call is issued. Auto Ads is a console setting: the runtime requires an operator confirmation but cannot inspect or override the account's console state.

Optional format responsive-horizontal uses Google's supported data-ad-format="horizontal" and data-full-width-responsive="false". It is still attached to an approved horizontal container and needs sufficient minimum approved width. Fixed units offer more predictable reserved space. Responsive units may choose a different height and cause layout movement; review the live approved unit on all sizes before use. Do not crop, distort, overlay or otherwise modify Google's creative or intercept clicks.

The loader is inserted only after a selected Google candidate has passed all approvals and current CMP permission, within 200px of the viewport. Permission is rechecked after async loading and before pushing the request. Existing unrelated AdSense loaders cause this provider to fail closed. A unit is requested once, with no automatic refresh. Script block, error, timeout or data-ad-status=unfilled removes that unit and permits a house/empty fallback. No tracking provider replaces a refused Google unit.

## Official references reviewed 19 October 2026

- https://support.google.com/adsense/answer/48182 — AdSense Program policies.
- https://support.google.com/publisherpolicies/answer/10502938 — Google Publisher Policies.
- https://support.google.com/adsense/answer/1346295 — placement policies.
- https://support.google.com/adsense/answer/9274025 — create a display unit.
- https://support.google.com/adsense/answer/9185043 — fixed-unit size guidance.
- https://support.google.com/adsense/answer/9183363 — supported responsive code changes.
- https://support.google.com/adsense/answer/9139818 — size optimisation.
- https://support.google.com/adsense/answer/13554116 — certified CMP requirements.
- https://support.google.com/adsense/answer/16942036 — TCF 2.3 transition.
- https://www.google.com/about/company/user-consent-policy/ — EU User Consent Policy.

Do not test real units with automated impressions, clicks, repeated reloads or personal clicks. The mock suite is the automated verification path. Account configuration and final approved deployment need an owner check.

Official Auto Ads controls/setup reference: https://support.google.com/adsense/answer/9261307 . Disable Auto ads and automatic optimisation options in the site's console settings; the central runtime cannot enforce a console change on your behalf. ads.txt guide: https://support.google.com/adsense/answer/12171612 .
