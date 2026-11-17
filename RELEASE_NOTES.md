# hijab-for-eye v2.2.0 — Per-video blur controls

## New features

- Eye button at the top center of each supported video.
- Click the eye to open a 0–100% blur slider that changes only that video.
- Customize the video eye size (20–80 px), eye opacity (0–100%), and slider panel opacity (0–100%) in the extension settings.
- Restore a video's normal blur with **Use global setting**. Close its panel with the eye button or Escape.
- Temporary blur resets when new media loads, the video source changes, or the page reloads. Other videos and saved global blur remain unchanged.

## Documentation

The README now includes plain-language download, installation, updating, and usage instructions for Chrome and Edge, examples of image thresholds, a troubleshooting table, privacy information, and known limitations. Previous image filtering and click-to-reveal features remain available.

## Download and install

Download **hijab-for-eye-v2.2.0.zip** below and extract it into a permanent folder. In Chrome open `chrome://extensions`; in Edge open `edge://extensions`. Enable **Developer mode**, click **Load unpacked**, and select the extracted folder containing `manifest.json`.

To update an existing installation, replace the files in its existing folder, click **Reload** on its extension card, then refresh website tabs. See the README for the full walkthrough.

## Validation and limitations

Automated tests pass for stored settings, image thresholds and reveals, independent video blur overrides, zero blur, global-setting changes, resets, size and opacity, keyboard closing, and cleanup. Real-browser visual testing remains outstanding. Custom overlays and native video fullscreen may hide controls. This release is on GitHub and is not published to the Chrome Web Store.
