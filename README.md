# dashboard-unfucker
Unfucks the twitterification of tumblr's dashboard by reverting it to the old layout as closely as possible while also offering control over other aspects of the UI.

## Installation
The script works with and is fully tested with Tampermonkey, Tampermonkey Beta, Greasemonkey, and Violentmonkey.
- Install any one of the script injector extensions listed above.
- Click on [unfucker.user.js](https://github.com/enchanted-sword/dashboard-unfucker/raw/main/unfucker.user.js) to install or update.
- NOTE: if you are updating from a version that ends in "b" (the no-flags version), the script will be installed separately instead of overwriting the existing script because they have different `@name` properties. You should disable or delete the old version of the script, as having both enabled will cause unintended behaviour.


## Features
The script uses window property flags to completely disable the vertical navigation layout, as well as Tumblr Live, the Tumblr Shop, and Tumblr Domains.
By default, it also reverts the latest activity, messaging, and searchbar updates, as well as removing the "post without tags?" popup in the post editor and re-adding the number of unread posts to the corner of the "home" icon in the navbar.

The features of the script are fully customizable in the sidebar config menu (the gear icon).

### Hide dashboard tabs
Hides the tabs at the top of the dashboard.

### Hide recommended blogs
Hides the Recommended Blogs sidebar item.

### Hide Tumblr Radar
Hides the Tumblr Radar.

### Hide Explore
Hides the explore icon in the navbar.

### Hide Tumblr Shop
Hides the Tumblr Shop icon in the navbar.

### Hide Badges
Hides users' badges normally displayed next to their username.

### Highlight likely bots in the activity feed
Marks new followers that are likely to be bots. The filter can sometimes indicate a false positive on new human users that have not yet updated their profile information; block at your own discretion.

### Show who follows you in the activity feed
Adds a "Following You" label to relevant notifications that matches the default "Mutuals" and "Following" labels.

### Content positioning
Controls the horizontal offset of the dashboard's content.

### Content width
Controls the width of the dashboard's content.

### Disable "virtual scroller" experiment
Disables the `virtualScroller` experiment, which modifies how posts in the timeline are handled.

### Disable Tumblr Live
Disables the Tumblr Live service and related icons (Where possible).

### Disable Tumblr Domains
Disables the Tumblr Domains icons where possible.

### Revert activity feed redesign
Reverts the latest activity feed redesign.

### Revert messaging redesign
Reverts the latest messaging redesign.

### Revert searchbar redesign
Reverts the latest searchbar and search prediction redesign.

### Enable custom dashboard tabs
Enables the custom dashboard tabs experiment, which allows the tabs to be customized (To the extent Tumblr considers "customizable").

### Enable adding polls to reblogs
Enables adding polls onto reblogged posts.

### Disable "post without tags" nag
Disables the popup that appears when attempting to create a post without adding tags first. 

### Re-add unread post notifications to the corner of the home icon
Re-adds the notification icon to the navbar's "home" icon that displays how many unread posts are in your feed.

### Display full note counts
Displays notes as a full, non-shortened number (E.g. "16,248 notes" instead of "16K notes").

## Troubleshooting
- Not fully tested on chromium or safari, but sources seem to say that it does work as intended.
- If it injects, but ends up wonky, chances are you just need to do a full reload of the page (ctrl + shift + r).
- If you've updated script versions but it doesn't fix a version-specific bug, it's likely because of browser caching, closing and reopening the browser usually fixes it.

## Known issues / Incompatibilities
- The script apparently conflicts with HTTPS Everywhere extension on Firefox.
- The script may conflict with Legacy & New XKit. However, it works just fine with XKit Rewritten.
- The header may rarely appear larger than normal. The exact cause of this is not known, but it seems to be fixed permanently by just searching something in the searchbar.
- Navigating between posts with the "J" and "K" hotkeys scrolls 100px short of the correct position; this is an issue with the hotkey function on Tumblr's end.