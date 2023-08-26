# dashboard-unfucker
Unfucks the twitterification of tumblr's dashboard by reverting it to the old layout as closely as possible

There are two versions:
- The default version (recommended)
- The no-flags version
- The icon-only version

The default version uses window property flags to completely disable the vertical nav layout update for your browser, as well as offering other features such as 
reverting the activity feed and messaging updates, re-enabling the use of the legacy post editor, and more. This version is the recommended version, but if it consistently fails to execute, you may have to use the no-flags version.

The no-flags version uses CSS and jQuery to simply move elements around on the page so that it resembles the non-vertical nav layout. This method isn't as thorough, but it should work for all users.

And lastly, the icon-only version only re-adds the icons to posts on the dashboard and reverts the post header changes.

The script was originally designed for Tampermonkey. Certain versions of the script may work with Violentmonkey and Greasemonkey, but due to the volume of problems they seem to encounter, neither are officially supported at the current time, although this will hopefully change in the future. If you want to use a non-userscript injection method, such as an adblocker, simply replace all instances of `unsafeWindow` with `window`.

## Installation
- Install the [Tampermonkey](https://www.tampermonkey.net/index.php) extension for your browser.
- Click on either [unfucker.user.js](https://github.com/enchanted-sword/dashboard-unfucker/raw/main/unfucker.user.js), [unfucker-noflags.user.js](https://github.com/enchanted-sword/dashboard-unfucker/raw/main/unfucker-noflags.user.js), [icons-only.user.js](https://github.com/enchanted-sword/dashboard-unfucker/raw/main/icons-only.user.js) or to install.
## Troubleshooting
- Not fully tested on chromium or safari, but sources seem to say that it does work as intended.
- If you're missing the dashboard tabs header (the navbar with following, for you, followed tags, etc.), prior to versions 3.5.0a and 4.0.0b it was disabled default, and can be reenabled via the first option in config menu.
- If it injects, but ends up wonky, chances are you just need to do a full reload of the page (ctrl + shift + r).
- If you've updated script versions but it doesn't fix a version-specific bug, it's likely because of browser caching, closing and reopening the browser usually fixes it.
- If the main content divider takes up the full width of the screen, that isn't caused by this script, that's the XKit Panorama feature, which can be disabled in the XKit config menu.

## Known issues / Incompatibilities
- The script apparently conflicts with HTTPS Everywhere extension on Firefox.
- The script apparently conflicts with New XKit. However, it works just fine with XKit Rewritten.
- The script is currently incompatibile with the Firemonkey extension.
- When first enabling the legacy editor toggle for text posts, an error popup will appear in the new post window. However, this popup can be safely dismissed and the editor will work normally.
