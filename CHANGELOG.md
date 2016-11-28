# TeamSnap JavaScript SDK CHANGELOG

### November 28, 2016 // Version 1.21.2
- Adds exportability to `EVENT_SETS` in `assignments`.

---

### November 22, 2016 // Version 1.21.1
- Adds ASSIGNMENTS_ENABLED_FOR_CODE to teamPreferences.

---

### November 21, 2016 // Version 1.21.0
- Adds `createBulkAssignments` method.
- Reloads `assignments` in `createBulkAssignments` method in persistence layer.

---

### November 10, 2016 // Version 1.20.0
- Adds `divisionEvents` endpoint.

---

### Oct 13, 2016 // Version 1.19.1
- Reloads `messageData` in `bulkDeleteMessages` method in persistence wrapper.

---

### Oct 5, 2016 // Version 1.19.0
- Add `divisionPreferences` endpoint.

---

### October 10, 2016 // Version 1.18.0
- Adds `bulkDeleteMessages` method.

---

### September 30, 2016 // Version 1.17.0
- Add `divisions` endpoint.
- Update validations on `broadcastEmail`.`saveBroadcastEmail`.
- Add `bulkDeleteBroadcastEmails` method.
- Add `divisionLoadMembers` method.
- Add `divisionLoadTeams` method.

---

### September 27, 2016 // Version 1.16.1
- Reloads `messages` and `messageData` in `markMessageAsRead` method in persistence wrapper.

---

### September 14, 2016 // Version 1.16.0
- Adds `reorderAssignments` method to `assignments`.

---

### September 12, 2016 // Version 1.15.4
- Fix typo in `deleteEvent` method in persistence wrapper.

---

### September 7, 2016 // Version 1.15.3
- Ensure bulkLoad filters are properly being parsed.

---

### July 28, 2016 // Version 1.15.2
- Adds `sendingMemberId` to `sendAssignmentEmails` method.

---

### July 19, 2016 // Version 1.15.1
- Reloads `memberAssignments` in `saveAssignment` method in persistence wrapper.
- Reloads `assignments` in `saveMemberAssignment` method in persistence wrapper.
- Reloads `assignments` in `deleteMemberAssignment` method in persistence wrapper.
- Removes `memberAssignments` in `deleteAssignment` method in persistence wrapper.
- Removes `memberAssignments` in `deleteMember` method in persistence wrapper.
- Removes `memberAssignments` in `deleteEvent` method in persistence wrapper.

---

### July 15, 2016 // Version 1.15.0
- Removes `memberId` validation from `saveAssignment` method.
- Adds `sendAssignmentEmails` method.
- Adds `loadMemberAssignments` method.
- Adds `createMemberAssignment` method.
- Adds `saveMemberAssignment` method.
- Adds `deleteMemberAssignment` method.
- Adds `memberAssignment` type.
- Reloads `assignments` in `saveMemberAssignment` method in persistence wrapper.
- Reloads `assignments` in `deleteMemberAssignment` method in persistence wrapper.

---

### June 21, 2016 // Version 1.14.0
- Adds `loadMemberPhotos` method.
- Adds `loadMemberPhoto` method.
- Adds `loadTeamPhotos` method.
- Adds `loadTeamPhoto` method.

---

### June 21, 2016 // Version 1.13.5
- Reloads `messages` and `messageData` in `saveBroadcastEmail` method in persistence wrapper.

---

### June 1, 2016 // Version 1.13.4
- Reloads `members` in `importMembersFromTeam` method in persistence wrapper.

---

### May 5, 2016 // Version 1.13.3
- Reloads `messages` and `messageData` in `saveBroadcastAlert` method in persistence wrapper.

---

### April 21, 2016 // Version 1.13.2
- Adds error message to `broadcastEmail` if saving without recipients and the
  email is not a draft. Added tests for saving a broadcastEmail with no recipients.

---

### April 1, 2016 // Version 1.13.1
- Reloads `contacts`, `contactPhoneNumbers` and `memberPhoneNumbers` in `importMembersFromTeam` method
  in persistence wrapper.

---

### March 22, 2016 // Version 1.13.0
- Adds `loadMessages` method.
- Adds `markMessageAsRead` method.
- Adds `loadMessageData` method.

---

### March 21, 2016 // Version 1.12.1
- Reloads `memberEmailAddresses` and `contactEmailAddresses` in `importMembersFromTeam` method
  in persistence wrapper.

---

### March 7, 2016 // Version 1.12.0
- Adds `importMembersFromTeam` method.
- Adds `loadImportableMembers` method.

---

### March 2, 2016 // Version 1.11.2
- Adds error message to `memberPaymentTransaction` is `amount` is null.

---

### March 2, 2016 // Version 1.11.1
- Reloads `paymentNotes` in `saveMemberPayment` method in persistence wrapper.
- Reloads `paymentNotes` in `memberPaymentTransaction` method in persistence wrapper.

---

### Feb 26, 2016 // Version 1.11.0
- Adds `memberPaymentTransaction` method.
- Adds persistence wrapper to `memberPaymentTransaction` to reload `teamFee` and `memberBalance`.

---

### Feb 17, 2016 // Version 1.10.0
- Adds `inviteMemberEmailAddresses` method.
- Lock down dependencies while we investigate upgrading to latest and greatest.

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
