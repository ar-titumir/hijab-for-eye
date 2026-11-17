# hijab-for-eye

Blur videos and larger images while you browse, with controls you can adjust yourself. For desktop Google Chrome and Microsoft Edge on a computer.

**Created by ar-titumir** · [azizureee19@gmail.com](mailto:azizureee19@gmail.com) · [MIT License](LICENSE)

**Current version: 2.3.0.** This extension is available from GitHub. It has **not** been published to the Chrome Web Store yet. You do not need Python, programming knowledge, or a paid account to install this GitHub version.

## 1. Download and install

1. Open the [latest release page](https://github.com/ar-titumir/hijab-for-eye/releases/latest).
2. Under **Assets**, click **hijab-for-eye-v2.3.0.zip**. Choose the extension ZIP, not the links named “Source code.”
3. Find the downloaded ZIP, usually in your **Downloads** folder.
4. On Windows, right-click it and choose **Extract All**, then **Extract**. A ZIP is a compressed folder; the browser needs the extracted files. On macOS, double-click the ZIP to extract it.
5. Move the extracted folder somewhere you will keep it, such as **Documents → hijab-for-eye**. Do not delete or move it after installation. Inside it you should see a file named **manifest.json**; Windows may display it simply as **manifest**.
6. Open Chrome or Edge. Click the address bar at the top, type the address below for your browser, and press **Enter**:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
7. Turn on **Developer mode**. This lets the browser load the extension from your computer. Chrome normally shows this switch at the upper right; Edge may show it in the left-hand menu.
8. Click **Load unpacked**. A folder-selection window opens. Select the extracted folder that directly contains **manifest.json**, then click **Select Folder**. Do not select the ZIP itself or a folder above the extracted files.
9. You should see a card named **hijab-for-eye**. Keep its on/off switch turned on.
10. Open the browser's **Extensions** menu (usually the puzzle-piece icon beside the address bar). Pin **hijab-for-eye**, or choose to show it in the toolbar, so its button is easy to find.
11. Refresh any websites that were already open using the browser's reload button or **Ctrl+R**.

If an older extension named **YouTube Blur** or **Media Blur** is installed, switch it off to avoid two blur filters competing with each other. Installing in Chrome does not install it in Edge; repeat the steps if you use both browsers.

## 2. Open the settings

Click the **hijab-for-eye** icon next to the browser address bar. If you cannot see it, open the Extensions menu and click its name.

The settings panel can scroll. Move your pointer over it and scroll down to see all the controls. Your choices save automatically on this computer; there is no Save button.

- **Enable blur:** the main switch. Turn it off to pause all blur and hide the on-video controls. Turn it on to use your saved settings again.
- **Blur videos:** turns video blur and video eye controls on or off.
- **Video strength:** the normal blur amount for videos across your supported tabs.
- **Blur images:** turns image filtering on or off.
- **Image strength:** the blur amount for images that pass your size filter.

Drag a slider to the left for less and to the right for more. Blur, size, threshold, and time sliders increase slowly at first and faster toward the right. Opacity sliders use the reverse curve, giving you finer control near 100%. The number beside each slider is its actual value. **0%** is clear; **100%** is the strongest blur this extension provides. Maximum blur does not guarantee that content is completely hidden.

On first installation, video blur is on at 50%. Image blur is off. Audio and playback are not changed by the extension.

## 3. Change blur for just one video

1. Make sure **Enable blur** and **Blur videos** are switched on.
2. Open a webpage containing a video. Look for the small **eye button at the top center of the video**.
3. Click the eye. A small panel labeled **This video only** appears with a slider and a percentage.
4. Drag that slider until the picture looks right. Only this video changes; other videos and your normal Video strength setting stay the same.
5. Click the eye again, click outside its controls, or press **Escape** while using the panel to close it. It also closes after the selected delay when your mouse leaves the video and its controls. Closing the panel keeps your temporary blur amount.
6. To return to your normal Video strength, click **Use global setting** in the panel. “Global” means the normal setting used across your tabs.

This temporary adjustment is not saved permanently. It resets when the page reloads, new media loads into the player, or the video source changes. A site that reloads its player may therefore reset the adjustment. Turning the main switch off and on pauses and restores the temporary adjustment while the same video remains loaded.

### Make the video controls larger or more transparent

Open the extension settings and click **On-video controls**, below Video strength, to expand these options:

- **Eye size:** 12–100 pixels. Increase it if the button is hard to see or click.
- **Eye opacity:** 0–100%. A lower number makes the eye more transparent; a higher number makes it more solid.
- **Slider panel opacity:** 0–100%. Controls the transparency of the panel that appears on the video. This does not change video blur.
- **Hide after leaving video:** 0–4,000 milliseconds. Move the mouse outside the video and its controls to start this timer. Clicking outside the controls closes the panel immediately. Returning to the video cancels the countdown. Keyboard navigation keeps focused controls open. 1,000 ms means one second.

At 0% opacity a control is invisible until you hover over it or reach it using the keyboard. For easy use, start around 70% eye opacity and 90% panel opacity. The eye becomes fully visible on hover or keyboard focus. A panel set above 0% keeps its chosen opacity while you adjust it.

## 4. Blur only images larger than a chosen size

Turn on **Blur images**, then select one option under **Filter images by**:

| Option | What is measured | Example |
| --- | --- | --- |
| Width | How wide the image appears on the page | A threshold of 200 px blurs images wider than 200 pixels. |
| Height | How tall the image appears on the page | A threshold of 200 px blurs images taller than 200 pixels. |
| Area | Displayed width multiplied by displayed height | A 300 × 200 image has an area of 60,000 px². It blurs with a 40,000 px² threshold. |

Only one option is selected at a time. Drag **Blur if greater than** to choose the threshold; the number beside it shows your choice.

An image exactly equal to the threshold stays clear. Measurements use the image's displayed size on the page, not the size of its original file. Resizing the window or changing browser zoom may change which images qualify.

The default is **Width greater than 200 px**. The maximum adapts to the display size reported by your browser: Width maximum = display width × 1.25; Height maximum = display height × 1.25; Area maximum = display width × display height × 1.25. These are CSS pixels, which may differ from physical pixels when system scaling is enabled. For a reported 1920 × 1080 display, the maxima are 2,400 px, 1,350 px, and 2,592,000 px². Reopen the popup after moving to another monitor; thresholds above its limit are reduced and saved. When you switch between a dimension and Area, the slider converts the number using a square-size equivalent as a starting point; adjust it to suit the page.

### Reveal one image

Click the **eye in the center of a blurred image**. That image becomes clear. Its eye button disappears unless you enable the temporary re-blur button described below. Other images are unchanged. It stays revealed until you refresh the page or the site replaces that image's source. Refresh the page to blur revealed images again.

Use **Eye icon size** (12–100 px) to change the image button size. Use **Eye icon opacity** in the image section to change how transparent these image buttons look. This setting is separate from the video eye settings. At 0%, image buttons appear when hovered or reached with the keyboard.

### Blur a revealed image again

Turn on **Show re-blur button** in the image settings. Three more controls appear:

- **Re-blur icon size:** 12–100 pixels.
- **Re-blur icon opacity:** 0–100%.
- **Visible duration:** 0–4,000 ms. 2,000 ms means two seconds; 0 ms means the button is not shown.

After you click an image's eye to reveal it, a crossed-eye button appears briefly in the same place. Click it to blur that image again. When its timer expires, only the button disappears—the image stays clear. Refresh the page to reset revealed images after the button has gone.

### Choose which websites are affected

Open **Where to blur** near the top of the popup.

- **All sites:** apply blur everywhere the extension supports. This disables the Only these sites checkbox while selected.
- **Only these sites:** first turn off All sites, then check this option. Enter sites separated by commas, for example `youtube.com, example.com`. This mode disables All sites and Exclude these sites. An empty list means no websites are blurred.
- **Exclude these sites:** apply blur except on the listed websites. You may use this with All sites or by itself. It is disabled while Only these sites is on.

If all three boxes are off, blur is off on every site. The main Enable blur switch still pauses everything regardless of the lists.

Use **Include this tab** next to a list to add the current website to that list. In the exclusion section, this means **exclude the current website**. Use **Remove this tab** to remove a matching entry. Buttons are available when the relevant mode is selected and the current tab is a normal website. If you remove a parent-domain entry, its subdomains are removed from that rule too.

Domains include their subdomains: `youtube.com` also covers `www.youtube.com`. Entering a full website URL is okay; it is converted to its domain. These are website rules, not rules for individual page paths. The lists cannot overlap, including parent/subdomain overlaps: the list you edit most recently keeps the entry and matching entries are removed from the other list. A note tells you when this happens.

Rules follow the top-level website of a tab. For example, a YouTube player embedded in `example.com` follows the rule for `example.com`.

## 5. Update an existing installation

If you already installed this extension from a local folder:

1. Download the ZIP for the new release and extract it.
2. Close the extension's settings panel if it is open.
3. Copy the extracted files and folders into the **same permanent folder you originally loaded**. Choose **Replace the files** when asked. Keep the `icons` folder too.
4. Open `chrome://extensions` or `edge://extensions`.
5. Find **hijab-for-eye** and click the small **Reload** button on its card (a circular arrow).
6. Check that the card or its Details page shows **2.3.0**. Refresh your website tabs.

Updating in the same folder normally keeps your saved settings. If you instead remove the old extension and install from another folder, you may need to choose your settings again. Do not keep two copies enabled.

## 6. If something does not work

| Problem | What to try |
| --- | --- |
| “Manifest file is missing” or the folder will not load | Extract the ZIP first. Select the folder directly containing `manifest.json`. |
| I cannot find the extension button | Open the puzzle-piece Extensions menu and pin hijab-for-eye. |
| A page stays clear | Refresh it, check Enable blur and the appropriate media switch, and make sure the strength is above 0%. Check the extension's website access in its Details page. |
| Some images stay clear | They may be below the threshold, already revealed, or excluded by a site rule. Try reducing the threshold and checking Where to blur. |
| YouTube home thumbnails blur, but sidebar thumbnails stay clear | Sidebar thumbnails are smaller. With Height greater than 188 px, a 90 px-tall thumbnail correctly stays clear. Lower the threshold (for example, Height greater than 80 px), choose Width, or use 0 to blur all nonzero-sized supported images. This update also rescans images after YouTube navigation and supports images inside open shadow roots. |
| Small icons or logos are blurred | Increase the image size threshold or switch off Blur images. |
| I cannot find the new controls | Reload the extension, verify version 2.3.0, and refresh the website. Scroll the popup; video appearance settings are inside On-video controls. |
| The video eye is missing | Enable Blur videos, increase eye opacity, and try a normal-sized in-page player. Very small, off-screen, fullscreen, or custom players can hide the controls. |
| The video adjustment reset | The page may have refreshed or loaded a new media source. Temporary adjustments do not persist through those changes. |
| Blur is slow on a busy page | Lower blur strength or disable image blur. Large pages with many media elements can use more computer resources. |
| The extension does not work in a private window | Extensions are normally disabled there. If you want it there, enable Allow in Incognito / Allow in InPrivate in the extension's Details page. |
| A work/school browser refuses installation | Your organization's browser policy may block locally installed extensions. Contact its administrator. |

## 7. What is supported, and what is not

Works on normal HTTP/HTTPS websites with standard HTML videos and images, including many GIFs, thumbnails, dynamically loaded images, and embedded frames when site access is allowed. Settings apply across supported tabs in the browser where the extension is installed.

Browser settings pages, extension stores, the browser's built-in PDF viewer, and local files are excluded. CSS background images, canvas/WebGL content, media inside closed shadow roots, videos inside shadow roots, and native picture-in-picture are not supported. Images inside open shadow roots are supported. Some site overlays, custom players, menus, animation, and fullscreen modes may hide or misalign the eye controls. Normal player-container fullscreen is supported where the page allows the overlay; native video-only fullscreen may hide it.

The extension blurs the video picture. Some native player controls may also look blurred. Audio continues normally. A brief clear frame can appear as a page loads or media is detected. This is a visual preference tool, not a guarantee that unwanted content is hidden.

## 8. Pause or remove it

To pause blur, turn off **Enable blur** in the settings. To disable the entire extension, turn off its card at `chrome://extensions` or `edge://extensions`. To uninstall it, click **Remove** on that card. Removing the extension deletes its saved preferences.

## Privacy and help

Settings and your chosen include/exclude domain lists stay on your computer. The extension uses active-tab access only to identify the current website when you open its popup for the site-list buttons. Temporary video adjustments and image reveals stay in the current page's memory. No analytics, tracking, external services, or media uploads are used. [Read the privacy policy](PRIVACY.md).

For help, [open a GitHub issue](https://github.com/ar-titumir/hijab-for-eye/issues). Describe your browser, extension version, the affected website, and what happened. Do not include passwords or private information.

## Release history and testing

See [CHANGELOG.md](CHANGELOG.md) for version notes. Automated settings and media-control checks pass; real-browser visual testing is still outstanding. The extension has not been submitted to or approved by the Chrome Web Store.

For developers only, run the dependency-free checks with Node.js:

```sh
node tests/test.cjs
node tests/images.cjs
node tests/videos.cjs
node tests/settings.cjs
node tests/popup.cjs
```
