# hijab-for-eye — Chrome and Edge

## New in 2.1.0

Image blur now filters by displayed Width, Height, or Area (width × height). Only images strictly greater than the selected threshold are blurred. The default is width greater than 200 CSS pixels. Width/height thresholds range from 0–4,000 px; area ranges from 0–4,000,000 px².

Each eligible visible image gets a centered eye button. Click it to reveal that image until the page reloads; changing the image source resets its reveal. The eye opacity is adjustable from 0–100% (default 70%); hover and keyboard focus show the button fully. Resize, load, and scroll events update image eligibility and button positions. Eye buttons may not appear in fullscreen/top-layer content or custom overlays.

To update an unpacked installation, replace its files or use the updated source folder, click Reload on the extension card, then refresh website tabs.

Separate 0–100% blur controls for videos and images across HTTP and HTTPS websites. Settings apply globally to all tabs and are saved on this device. Video blur starts enabled at 50%; image blur starts off. The master switch pauses both without resetting strengths.

## Install

1. Extract the ZIP and keep the `hijab-for-eye` folder in a permanent location.
2. Disable or remove the previous **YouTube Blur** extension to avoid conflicting filters.
3. Open `chrome://extensions` or `edge://extensions`.
4. Enable **Developer mode**, click **Load unpacked**, and select the folder containing `manifest.json`.
5. Reload your existing website tabs. Pin **hijab-for-eye** from the Extensions menu.
6. Click its icon. Enable videos, images, or both and adjust their separate sliders.

The browser requests access to websites because the extension must apply its visual filters there. Browser extension settings can restrict its site access if desired. This version is a separate extension; previous YouTube Blur settings are not migrated.

## Coverage

- Standard HTML videos, images (including GIFs, responsive pictures, thumbnails, and logos), image buttons, and SVG image elements.
- Dynamically inserted media and normal fullscreen video. In a native video player, controls may be blurred along with the video; separate page controls are not targeted.
- Matching embedded frames, including cross-origin frames where the browser grants site access.
- Audio and playback are not modified. Set strength to zero or switch a category off to remove its filter override.
- 100% means the configured maximum of 40 CSS pixels, not guaranteed concealment.

## Limitations

No extension can alter every browser surface. Browser internal pages, extension stores, the built-in PDF viewer, and other protected pages are excluded. Local files are not included. Native picture-in-picture, canvas/WebGL rendering, CSS background images, and media inside shadow DOM are not supported by this version. Styling from a site or another extension may conflict. Blur can briefly be absent while settings load and is not a privacy/security barrier.

## Privacy

No analytics, network requests, remote code, or external dependencies. The only API permission is `storage`; website access comes from the HTTP/HTTPS content-script matches. No browsing data is collected or sent anywhere.

## Validation

JavaScript syntax, manifest resources, and simulated settings lifecycle are checked locally. Live website/browser testing has not been performed.

Run the dependency-free checks with Node.js:

```sh
node tests/test.cjs
node tests/images.cjs
```
