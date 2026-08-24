# Donsol Tourism publishing guide

Publish only the visitor-facing release files. Photographs and videos are loaded from approved external HTTPS links and are not included in the website release package. Raw media, experiments, and older versions must not be copied to the public web server.

## Release structure

```text
Tourism.html
whale-sharks.html
firefly-river.html
kayaking.html
travel-guide.html
privacy.html
accessibility.html
disclaimer.html
media-credits.html
site-map.html
robots.txt
sitemap.xml
assets/
  css/
    tourism.css
    destination.css
  js/
    tourism.js
  fonts/
    barabara-final.otf
```

## Public release files

- `Tourism.html`
- `assets/css/tourism.css`
- `assets/css/destination.css`
- `assets/js/tourism.js`
- `assets/fonts/barabara-final.otf`
- `whale-sharks.html`
- `firefly-river.html`
- `kayaking.html`
- `travel-guide.html`
- `privacy.html`
- `accessibility.html`
- `disclaimer.html`
- `media-credits.html`
- `site-map.html`
- `robots.txt`
- `sitemap.xml`

## Keep off the public server

- `Sources/`
- `older versions/`
- `Tourism/`
- `videos/`
- `og-donsol.png` and other local media drafts; production metadata uses an approved external image URL
- local master images that are already delivered through the approved external media account
- `fonts/` source archives; the production font is published from `assets/fonts/`
- font ZIP archives and editor settings
- `docs/` internal deployment, measurement, content-operations, and media-accessibility handoff files
- `scripts/` validation utilities

## Before every public release

1. Confirm Tourism Office contact details, office hours, activity status, event dates, visitor rules, and time-sensitive guidance.
2. Confirm that every published photograph or video has a rights record containing the creator or rights holder, original source URL, permitted use, attribution text, approval evidence, start date, expiry or review date, and removal contact.
3. Review feedback handling, the Privacy Notice, retention rules, and the LGU privacy contact.
4. Check all internal links, phone numbers, email links, maps, social links, and policy pages.
5. Test keyboard navigation, mobile layouts, reduced motion, captions or transcripts, and 200% browser zoom.
6. Run a mobile performance report and confirm that the poster loads before optional video.
7. Back up the current public release before replacing it.
8. After publishing, submit `https://www.donsol.gov.ph/sitemap.xml` through the municipality's verified search account.

## External media link standard

Use only stable, direct HTTPS image or video URLs from an approved CDN or media account. Do not link to a social-media post, temporary sharing URL, personal drive link, or another website's page asset. Video hosts must support byte-range requests so visitors can seek without downloading the full file. Keep a poster image and meaningful alternative text for every video, add captions or a transcript when speech conveys information, and maintain a local rights register even though the media files themselves are not stored with the website.

The Tourism Office should be able to replace or disable each external asset promptly. Check links before every release and on a recurring schedule because a third-party file can be removed, replaced, rate-limited, or changed without a website deployment.

## Server checklist

The hosting administrator should enforce HTTPS and review Content Security Policy, HSTS, frame-ancestor or X-Frame-Options protection, Referrer-Policy, Permissions-Policy, compression, and browser-cache rules. Redirect any alternate tourism URL to the canonical `https://www.donsol.gov.ph/Tourism.html` address.
