# TeamSnap JavaScript SDK CHANGELOG

### Jan 8, 2016 // Version 1.7.2
- Persistence fix when changing statisticGroupId to null on a statistic.
- Update CHANGELOG formatting - much easier to read.

---

### Jan 6, 2016 // Version 1.7.1
- Persistence fix in teamMediaGroups - related to: https://github.com/teamsnap/apiv3/pull/1703

---

### Jan 4, 2016 // Version 1.7.0

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
