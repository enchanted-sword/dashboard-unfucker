# dashboard-unfucker
Unfucks the twitterification of tumblr's dashboard by reverting it to the old layout as closely as possible

There are two versions:
- Version A: unfucker.user.js
- Version B: unfucker-noflags.user.js

Version A uses window property flags to effectively disable the A/B vertical nav layout test for your browser, as well as offering other features such as 
reverting the activity feed and messaging updates and re-enabling the use of the legacy post editor. However, this process is finicky, and does not appear to work for all users.

Version B uses jQuery to simply move elements around on the page so that it resembles the non-vertical nav layout. This method isn't as thorough, but it should work for all users.

It's a userscript designed for Tampermonkey, but feel free to port it to other JavaScript injection methods as you please.

To install, simply click on either `unfucker.user.js` or `unfucker-noflags.user.js` and click the `raw` button with Tampermonkey installed.

## Troubleshooting
- Not tested on fully on chrome, but sources seem to say that it does work as intended.
- If it injects, but ends up wonky or all shoved over to the left side of the page, chances are you just need to do a full reload of the page (ctrl + shift + r).
- If you've updated script versions but it doesn't fix a version-specific bug, it's likely because of browser caching, just do a full reload of the page.
- If the main content divider takes up the full width of the screen, that isn't caused by this script. That's the XKit Panorama feature.

## Known issues
- The script apparently conflicts with HTTPS Everywhere extension on Firefox.
- The script apparently conflicts with New XKit. However, it works just fine with XKit Rewritten.
