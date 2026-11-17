# hijab-for-eye v2.3.1 — Image reveal fixes and reversed sliders

Created by **ar-titumir** · azizureee19@gmail.com · MIT licensed.

## Fixes and changes

- Fix image reveal when a browser rounds the stored CSS blur value. The original image filter is restored, and repeated updates no longer rewrite an unchanged rounded blur value.
- Hide the eye overlay during image visibility checks so it cannot obscure its own target and remove the re-blur control.
- Reverse the exponential curves: blur, threshold, size, and duration increase quickly first, then slowly. Opacity increases slowly first, then quickly. This includes the temporary video slider. Existing saved values and maximum limits are unchanged.

## Install or update

Download **hijab-for-eye-v2.3.1.zip**, extract it, and replace the files in your existing extension folder. On `chrome://extensions` or `edge://extensions`, click Reload, confirm version **2.3.1**, and refresh all website tabs. New users can follow README.md for step-by-step installation.

Chrome and Edge save settings separately. In each browser, turn on **Show re-blur button** and choose a duration above **0 ms** (try **2000 ms**) and a visible opacity (try **70%**). The image stays clear after this button expires.

## Validation

Automated suites cover settings, popup, lifecycle, images, and video controls. New image regressions simulate browser CSS rounding and shadow-overlay hit testing, including reveal, re-blur, repeated updates, and expiry. Live Chrome/Edge verification of the reported sites remains outstanding. Not published to the Chrome Web Store.
