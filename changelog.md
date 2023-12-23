# Changelog

## v5.6.2
- Fixed clipped icons appearing in blog view pages where they weren't supposed to
- Fixed the static avatars feature not working properly
- Fixed draft and queue pages not showing floating avatars

## v5.6.1
- Fixed avatars for the /blog pages and headers for the /explore page
- Fixed author avatars not showing up

## v5.6.0
- Added the "Revert header design" feature
- Added the "display poll results without voting" feature
- Fixed a minor ui bug with the advanced config menu
- Added the dragon

## v5.5.8
- Fixed the `border-radius` for the `bar` element
- Re-added the user portrait beside the `bar` element

## v5.5.7
- More header fix improvments
- Added validation for cloning the correct label
- Fixed logic error with original posts having a 'null' label added
- Prevented re-processing processed headers

## v5.5.6
- Improvements to the header fix method
- Fixed bug where reblog parent badges were always overwritten

## v5.5.5
- Fixed custom label styling
- Added `peeprHeaderBadgesWrapper` to the filter for the "hide badges" feature

## v5.5.4
- Fixed header bug

## v5.5.3
- Finally started using eslint
- Cleaned up minor errors
- Fixed note truncating on masonry pages to only come into effect when the string is longer than 9 chars

## v5.5.2
- Minor header fixes for specific cases
- Extra fallback for out-of-bounds range inputs
- Set notes on masonry view posts to properly hide the word "notes" (for space reasons, the unmodified layout does this as well)
- Use nonces on style tags

## v5.5.1
- Fixed a case where race conditions could cause the script to be injected without a nonce
- Fixed the content width slider having a negative lower bound
- Rewrote the header fix function to work as intended

## v5.5.0
- Improvements to the menu rendering methods
- Split the "hide recommended blogs and tags" feature into two features
- Added the "collapse the 'changes', 'staff picks', etc. carousel"
- Fixed the "hide recommended blogs" feature to target recommended blogs in blog view and tag pages
- Set empty blog view sidebars to collapse automatically
- Added the dragon

## v5.4.7
- Minor fix to visual ghosting with hidden dashboard blog recommendations
- Changed the hide recommendations feature to use a different method pending the full release of Firefox 121
- Removed temporary poll

## v5.4.6
- Added a temporary poll to investigate user browser choice metrics

## v5.4.5
- Changed the "hide recommended blogs" feature to also hide the recommended blog and tag carousels between posts in the timeline

## v5.4.4
- Fixed the potential bot filter not identifying bots with non-english titles
- Hid the new "ad-free" sidebar popup

## v5.4.3
- Fixed the "disable post without tags nag" toggle not having a correctly assigned label

## v5.4.2
- Fixed background borders on rollup avatars
- Fixed avatars being cut off in the activity feed

##v5.4.1
- Fixed borders showing on rollup badges

## v5.4.0
- Fixed the 'revert activity feed redesign' feature

## v5.3.3
- Added two additional options for messaging style: theme colours and custom colours

## v5.3.2
- Import blog title and link colours for messaging
- Fixed issue with messaging stylesheets affecting post timestamps
- The messaging feature now computes colour contrast ratios to determine if the message backgrounds should be white or black
- Fixed an additional timeline load when not using the "show hidden nsfw posts" feature

## v5.3.1
- Improved colour contrast for messaging blog descriptions

## v5.3.0
- Overhauled mutuation functions
- Moved the "display exact vote counts on poll answers" feature to the "general configuration" category
- Removed the "display full note count" feature since tumblr no longer shortens post note counts
- Added a new "revert messaging redesign" feature using CSS
- Simplified feature styles

## v5.2.2
- Added the "disable avatars scrolling with posts" feature
- Removed the "revert messaging redesign" feature (no longer functioned properly)

## v5.2.1
- Fixed a minor text colour discrepancy with some palettes
- Prettied up the inputs for the config menu

## v5.2.0
- Added config preference file importing/exporting
- Tweaked the appearance of the config menu

## v5.1.1
- Fixed masonry page content-sidebar overlap
- Removed the "enable the "reply from sideblogs" experiment" feature

The feature was apparently only be enabled on the frontend, and despite this, no errors would be returned by the `/v2/user/reply` requests. Instead, it would post as a reply from the user's main blog if they weren't part of the A/B group, but would still display as a sideblog reply to the person who posted it until the page was refreshed. Why Tumblr handles it like this, who knows.

## v5.1.0 (release version)
- Added a fallback style to ensure 3px border radius on posts
- Minor code improvements 

## v5.1.0 beta
- Added the "enable the "reply from sideblogs" experiment" feature

## v5.0.0 beta
- Improved the toggling of the notification-based features
- Added the "display exact vote counts on poll answers" feature
- Added the "show hidden NSFW posts in the timeline" feature
- Added the "messaging scale" feature

## v4.4.6
- Changed the custom notification labels to use theme colours

## v4.4.4/4.4.5
- Removed scroll offsets from permalink pages

## v4.4.2/4.4.3
- Fixed J and K not scrolling posts to the top of the screen

## v4.4.1
- Optimized potential bot detection filters to target certain bots with multiple posts
- Fixed duplicate labels when navigating to the activity page via the "show everything" button

## v4.4.0
- Optimized potential bot detection filters. This should help minimize false positives, but be aware that it still flags _potential_ bots.
- Added hover-tooltips to both notification label features (and additional text to the potential bot label) to identify them as features added by the script.
- Fixed a minor syntax error
- Cleaned up preference storage
- Added an indicator to show when the script has updated
- Removed the "revert post header changes" toggle now that that garbage fire has been scrapped
- Tweaked the default script preferences to better suit the scope of the script