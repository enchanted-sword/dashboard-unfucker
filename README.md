# dashboard-unfucker
Unfucks the twitterification of tumblr's dashboard by reverting it to the old layout as closely as possible

It's a userscript designed for Tampermonkey, but feel free to port it to other JavaScript injection methods as you please.

## Troubleshooting
- The script apparently conflicts with the HTTPS Everywhere extension on Firefox.
- Not tested on fully on chrome, but sources seem to say that it does work as intended.
- The issue where it would revert to the new layout when switching between the dashboard/blog/activity/etc pages is now fixed as of version 1.3.
- If it injects, but ends up wonky or all shoved over to the left side of the page, chances are you just need to do a full reload of the page (ctrl + shift + r).
- If you've updated script versions but it doesn't fix a version-specific bug, it's because of browser caching, just do a full reload of the page.

## Known issues and discrepancies
- The script no longer crashes the page when resizing but it messes with the vanilla mobile web layout if the page is LOADED at that width. This is currently considered a non-issue, since there's no reason to use this script on mobile devices as the mobile web layout was not changed. However this may necessitate a page reload if your browser application starts minimized
- The search bar occasionally does not load in until AFTER the script has taken effect, thus remaining attached to the sidebar. This is a work-in-progress.
- The account and settings sub-navigation menus will start expanded when loading certain Tumblr pages, and are much wider than the old layout. This will likely be fixed in the future.
- The new settings icon is still present in the navigation bar. This is a low priority, but in the future it may be moved back to the account sub-navigation menu.
