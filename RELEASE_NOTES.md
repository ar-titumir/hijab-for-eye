# hijab-for-eye v2.0.0

Adjust video and image blur across websites in Chrome and Microsoft Edge.

- Independent 0–100% sliders for videos and images.
- Category toggles and a master pause switch.
- Settings saved locally and applied across open tabs.
- Support for standard media elements, dynamically loaded media, and matching embedded frames.
- No analytics or external dependencies.

## Install

Download `hijab-for-eye-v2.0.0.zip` and extract it. Open `chrome://extensions` or `edge://extensions`, enable Developer mode, choose **Load unpacked**, and select the extracted `hijab-for-eye` folder. Disable older versions of the blur extension and reload existing tabs.

## Known limitations

Browser-protected pages, CSS background images, canvas/WebGL media, shadow DOM media, and native picture-in-picture are not supported. Blur is a visual effect, not guaranteed concealment. Live browser testing has not been performed; automated settings lifecycle and syntax checks pass.
