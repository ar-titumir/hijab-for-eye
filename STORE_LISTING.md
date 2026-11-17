# Chrome Web Store submission draft

Status: package prepared; not submitted. Live browser testing and a genuine product screenshot remain required before submission.

## Name
hijab-for-eye

## Summary
Adjust video and image blur across websites with separate saved controls.

## Description
hijab-for-eye lets you soften videos and images while browsing. Choose separate blur strengths for each media type, or pause both with one switch.

Features:
- Independent 0–100% blur controls for videos and images.
- Filter images by displayed width, height, or area with an adjustable threshold.
- Reveal individual blurred images using a centered eye button with adjustable opacity.
- Enable videos, images, or both.
- Saved local preferences applied across supported websites and open tabs.
- Works with standard HTML videos, images, animated GIFs, and dynamically added media.
- No analytics, tracking, or external services.

Video blur starts at 50%; image blur starts off. Image blur includes thumbnails and logos. Audio and playback continue normally.

Limitations: browser internal pages, extension stores, CSS background images, canvas/WebGL content, shadow DOM media, and native picture-in-picture are not supported. Blur is a visual effect, not a guarantee that content is hidden. Native video controls may also be blurred.

## Listing fields
- Language: English
- Suggested category: Tools (choose the corresponding current category in the dashboard)
- Website: https://github.com/ar-titumir/hijab-for-eye
- Support: https://github.com/ar-titumir/hijab-for-eye/issues
- Privacy policy: https://github.com/ar-titumir/hijab-for-eye/blob/main/PRIVACY.md
- Distribution: Public, free
- Store icon: icons/icon128.png
- Screenshot: still needed; capture the real extension in use at 1280 × 800 pixels. Do not use a fabricated screenshot.

## Privacy declarations
Single purpose: Let users adjust visual blur on video and image elements while browsing supported websites.

Storage justification: Save the user's on/off preference, selected media types, blur strengths, image size filter and threshold, and eye icon opacity on the device across browser sessions.

Website access justification: Content scripts run on HTTP and HTTPS websites and matching embedded frames to apply the user-selected CSS blur to media elements. Access is needed across sites because this is a general-purpose media blur extension. No page content is collected or transmitted.

Remote code: No. All executable code is included in the extension package.

User data collection: None. Only local extension preferences are stored.

## Submission steps
1. Register or sign in at https://chrome.google.com/webstore/devconsole. New developers must accept Google's agreement and pay the one-time registration fee. Complete any requested account verification yourself.
2. Test the extension on real sites, then capture at least one genuine 1280 × 800 screenshot showing its controls and effect.
3. Add a new item and upload `hijab-for-eye-chrome-web-store-v2.0.1.zip` (manifest is at the ZIP root).
4. Complete the listing and privacy fields using the text above, add the icon and screenshot, and select Public distribution.
5. Review the final declarations, then submit for Google's review. It is not searchable in the store until Google approves and publishes it.
