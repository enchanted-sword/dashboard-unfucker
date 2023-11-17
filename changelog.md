# Changelog

##v5.4.3
  - Fixed the "disable post without tags nag" toggle not having a correctly assigned label

##v5.4.2
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