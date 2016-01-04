# TeamSnap JavaScript SDK CHANGELOG

## Jan 4, 2015

## Version 1.7.0

- This CHANGELOG. This is a broad list of recent changes - expect future updates to be more granular and with greater frequency.
- Adds support for the following apiv3 types
  - `broadcastAlert`
  - `broadcastEmailAttachment`
  - `divisionContactEmailAddress`
  - `divisionContactPhoneNumber`
  - `divisionMemberEmailAddress`
  - `divisionMemberPhoneNumber`
  - `eventStatistic`
  - `statisticAggregate`
  - `teamMediaGroup`
  - `teamMedium`
  - `teamMediumComment`
  - `userFacebookPage`
- Various persistence updates related to the newly added types as well as some
  old types.
- Added new core method `file` - simliar to `exec` but with progress callback
- Removed duplicate `saveTeamPreferences` method.
- Updated some filenames to properly reflect their collection name.
- Documentation!
- Adds missing `loadSponsors` method.
