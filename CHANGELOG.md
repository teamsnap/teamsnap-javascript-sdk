# TeamSnap JavaScript SDK CHANGELOG

### Feb 17, 2016 // Version 1.10.0
- Adds `inviteMemberEmailAddresses` method.
---

### Feb 15, 2016 // Version 1.9.0
- Refactors `bulkLoad` to accept "Smart Load" params.

---

### Feb 4, 2016 // Version 1.8.1
- Update `canEditItem()` helper to return false when a manager attempts to edit an owner's member item.

---

### Feb 4, 2016 // Version 1.8.0
- Adds `bulkCreateEvents` method.

---

### Jan 26, 2016 // Version 1.7.6
- Addresses bug where, When saving a `statistic`, its `statisticGroup` may be incorrectly unlinked.

---

### Jan 20, 2016 // Version 1.7.5
- Reload `eventStatistics` teamwide when changes to `statistics` or `statisticData`.

---

### Jan 14, 2016 // Version 1.7.4
- Reload `memberEmailAddress` and `contactEmailAddress` when sending `invite`.

---

### Jan 13, 2016 // Version 1.7.3
- Persistence fixes related to `teamMediaGroup` items when sorting and saving `teamMedia`.

---

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
