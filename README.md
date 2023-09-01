# dashboard-unfucker
Unfucks the twitterification of tumblr's dashboard by reverting it to the old layout as closely as possible

The script version uses window property flags to completely disable the vertical nav layout update for your browser, as well as offering other features such as 
reverting the activity feed and messaging updates, re-enabling the use of the legacy text post editor, and more.

The script works with and is fully tested with Tampermonkey, Tampermonkey Beta, Greasemonkey, and Violentmonkey.

## Installation
- Install any one of the script injector extensions listed above.
- Click on [unfucker.user.js](https://github.com/enchanted-sword/dashboard-unfucker/raw/main/unfucker.user.js) to install or update.
- NOTE: if you are updating from a version that ends in "b" (the no-flags version), the script will be installed separately instead of overwriting the existing script because they have different `@name` properties. You should disable or delete the old version of the script, as having both enabled will cause unintended behaviour.

## Troubleshooting
- Not fully tested on chromium or safari, but sources seem to say that it does work as intended.
- If you're missing the dashboard tabs header (the navbar with following, for you, followed tags, etc.), prior to versions 3.5.0a and 4.0.0b it was disabled default, and can be reenabled via the first option in config menu.
- If it injects, but ends up wonky, chances are you just need to do a full reload of the page (ctrl + shift + r).
- If you've updated script versions but it doesn't fix a version-specific bug, it's likely because of browser caching, closing and reopening the browser usually fixes it.
- If the main content divider takes up the full width of the screen and you have not modified the "content width" slider, that isn't caused by this script, that's the XKit Panorama feature, which can be disabled in the XKit config menu.

## Known issues / Incompatibilities
- The script apparently conflicts with HTTPS Everywhere extension on Firefox.
- The script may conflict with New XKit. However, it works just fine with XKit Rewritten.
- When first enabling the legacy editor toggle for text posts, an error popup will appear in the new post window. However, this popup can be safely dismissed and the editor will work normally.