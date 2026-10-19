# Per-domain ads.txt

House-only sites do not need a Google seller record. For each Google-enabled participating domain, publish the publisher account's actual record at its root /ads.txt (not inside the central shared-ads project):

```text
google.com, pub-YOUR_16_DIGIT_PUBLISHER_ID, DIRECT, f08c47fec0942fa0
```

The publisher in ads.txt is pub-..., while JavaScript uses ca-pub-.... Never publish the mock test ID. Include any other genuinely authorised sellers according to their own requirements.

For custom subdomains, review Google's root-domain/subdomain crawling rules and domain ownership. A project hosted under an ordinary github.io path cannot itself publish a domain-root ads.txt for the whole github.io host. Use an owned custom domain with an appropriate root deployment before enabling Google; central configuration/path approval doesn't solve this.

npm run ads:check fetches HTTPS /ads.txt for every enabled, Google-approved site, omitting credentials/referrer, rejecting redirects and requiring the exact configured DIRECT publisher entry. It makes no request for house-only sites. A daily GitHub workflow and manual workflow dispatch repeat this check once Google sites exist. An origin that redirects needs explicit investigation and alignment with Google's rules; this conservative checker reports failure rather than silently following elsewhere. Network/crawler rules and AdSense console status still need owner verification.

Official guide: https://support.google.com/adsense/answer/12171612
