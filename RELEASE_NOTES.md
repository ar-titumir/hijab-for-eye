# hijab-for-eye v2.3.0 — Smart image controls and site rules

Created by **ar-titumir** · azizureee19@gmail.com · MIT licensed.

## What's new

- Exponential sliders: blur, icon size, image threshold, and duration start slowly and accelerate. Opacity sliders provide finer adjustment near 100%.
- Display-aware threshold limits: width, height, or area × 1.25, using the display size reported by the browser.
- Adjustable image eye size and video eye size, up to 100 px.
- Optional **Show re-blur button** after revealing an image, with size, opacity, and a visible duration of up to 4,000 ms. When the timer expires, only the button disappears.
- Video slider panels automatically close after a configured delay outside the video/controls or immediately on an outside click. Temporary per-video blur remains independent of saved global blur.
- **Where to blur**: all sites, only listed sites, or all except listed sites. Current-tab add/remove buttons and conflict-free domain lists. Embedded players follow the top-level website's rule.
- Improved dynamic image detection on YouTube navigation and in open shadow roots.
- MIT license, author credit in the popup, and expanded beginner installation/use instructions.

This release includes the per-video controls prepared for v2.2.0, which was not published due to unavailable approval review.

## YouTube thumbnail note

The size filter still applies. A sidebar thumbnail shorter than a Height threshold of 188 px remains clear by design. Lower that threshold (for example to 80 px), choose Width, or set 0 to cover all nonzero-sized supported images.

## Install or update

Download **hijab-for-eye-v2.3.0.zip**, extract it to a permanent folder, then open `chrome://extensions` or `edge://extensions`, enable Developer mode, and choose Load unpacked. Select the folder containing `manifest.json`.

To update an existing installation, replace files in its current folder, click Reload on the extension card, then refresh website tabs. This version adds `activeTab` permission for the user-operated current-site buttons. Check that the extension remains enabled after updating. The ZIP includes the full plain-language README, license, and privacy policy.

## Validation

Automated tests cover settings lifecycle, popup controls, curve mapping, thresholds, domain rules, embedded-frame hostname selection, image reveals and timed re-blur, open-shadow images, independent video overrides, timer dismissal, and cleanup. ZIP contents and version metadata are validated. Real-browser visual verification remains outstanding; custom players, native video fullscreen, and closed shadow roots can limit coverage. Not published to the Chrome Web Store.
