# Version history

## v2.3.2 - November 17, 2026

- Use one accelerating exponential curve for every slider: slow increases at the start, gradually faster increases toward the maximum. Includes opacity and temporary per-video blur.
- Preserve saved values, limits, and the image reveal fix from v2.3.1.
- Remove reverse-curve options and verify accelerating increments across supported ranges.


## v2.3.1 - November 17, 2026

- Fix image reveal restoration when browsers round fractional CSS blur values.
- Exclude the eye overlay from image visibility checks to prevent self-obstruction.
- Reverse all exponential slider curves, including per-video blur. Existing saved values and limits are preserved.
- Clarify that Chrome and Edge keep separate settings for the optional re-blur button.
- Add regression tests for CSS rounding, repeated updates, and overlay hit testing.

## v2.3.0 — November 17, 2026

- Exponential sliders for blur, thresholds, icon size, and durations; reversed curves for finer opacity adjustment near 100%.
- Image thresholds now use the browser-reported display width, height, or area × 1.25 as their maximum.
- Image eye and re-blur icon sizes are adjustable up to 100 px. Video eye size also supports 100 px.
- Optional **Show re-blur button**, with size, opacity, and visible duration (up to 4,000 ms).
- Video slider panels close after a configurable delay outside the video/controls, on outside click, or with Escape.
- All-sites, only-listed-sites, and exclusion-list controls, with current-tab add/remove buttons and disjoint domain lists.
- Image detection rescans after YouTube navigation, covers images in open shadow roots, and restores original inline filters when blur is removed.
- Small YouTube sidebar thumbnails remain subject to the chosen size threshold; lowering it is necessary when their displayed dimensions are below it.
- Added MIT license and ar-titumir's requested name/email credit.
- Includes the per-video controls prepared in v2.2.0; that version was not published because GitHub approval review was unavailable.
- Expanded plain-language documentation and automated settings, popup, image, and video tests. Live browser verification remains outstanding.

## v2.2.0 — November 17, 2026

- Added an eye button at the top center of each supported video.
- Clicking the eye opens a slider that changes blur only for that video.
- Temporary adjustments stay on the current page and reset when new media loads, the video source changes, or the page reloads.
- Added a **Use global setting** button and Escape key to close the video slider.
- Added video eye size (20–80 px), eye opacity (0–100%), and slider panel opacity (0–100%) settings.
- Expanded the README with plain-language installation, updating, usage, and troubleshooting instructions.
- Automated tests cover independent video overrides, resets, settings, image filtering, and lifecycle behavior. Real-browser visual testing remains outstanding.

## v2.1.0 — November 17, 2026

- Image filtering by displayed Width, Height, or Area with an adjustable threshold.
- Centered eye button to reveal individual images and adjustable image eye opacity.

## v2.0.1 — November 17, 2026

- Added extension icons, a privacy policy, and a Chrome Web Store upload package.

## v2.0.0 — November 17, 2026

- Initial hijab-for-eye release with separate video and image blur controls across supported websites.
