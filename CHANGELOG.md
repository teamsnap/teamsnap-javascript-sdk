# TeamSnap JavaScript SDK CHANGELOG

### April 23, 2018 // Version 1.57.0
- Add `createPartnerUserPreferences` method.
- Add `savePartnerUserPreferences` method.

--

### March 16, 2018 // Version 1.56.0
- Adds `loadPersonas` method from `members` collection queries.

--

### March 9, 2018 // Version 1.55.0
- Adds support for `partnerPreferences` type and `loadPartnersPreferences` method

--

### February 19, 2018 // Version 1.54.0
- Adds support for `forecast` type and `loadForecasts` method

--

### February 19, 2018 // Version 1.53.0
- Reloads `contacts` for member in `saveContact` in persistence layer.
- Reloads `contacts` for member in `saveContactEmailAddress` in persistence layer.
- Reloads `contacts` for member in `deleteContactEmailAddress` in persistence layer.
- Reloads `contacts` for member in `saveContactPhoneNumber` in persistence layer.
- Reloads `contacts` for member in `deleteContactPhoneNumber` in persistence layer.

--

### Feb 9, 2018 // Version 1.52.0
- Add `teamNames` collection.

---

### January 25, 2018 // Version 1.51.0
- Update to run on node `>=7` and npm `>=3`

---

### November 14, 2017 // Version 1.50.0
- Adds support for `advertisements` collection.

---

### October 18, 2017 // Version 1.49.0
- Adds teamId param to `sendEmailValidation` command.

---

### October 17, 2017 // Version 1.48.0
- Adds support for `teamStores` collection.
- Adds `loadTeamStores` method.

---

### October 16, 2017 // Version 1.47.0
 - Removes reloading `contactEmailAddresses` in `saveMemberEmailAddress` in persistence layer.
 - Conditionally exclude `memberEmailAddresses` and `memberPhoneNumbers` from reloading in
   `disableMember` and `importMembersFromTeam` in persistence layer.
 - Bug Fix: Remove check for null features when setting `features` in `auth`

 ---

### October 16, 2017 // Version 1.46.0
- Pass `features` to SDK via `auth`'s `options` param.
- Conditionally exclude `memberEmailAddress` and `memberPhoneNumber` from being
  reloaded on `invite` in persistence layer, based on new `features` options.

---

### October 10, 2017 // Version 1.45.0
- Reloads `contactPhoneNumbers` in `inviteContactEmailAddresses` in persistence layer.
- Reloads `contactEmailAddresses`, `contactPhoneNumbers` and `members` in `saveContact` in persistence layer.
- Reloads `contactPhoneNumbers` in `saveMemberPhoneNumber` in persistence layer.

---

### September 29, 2017 // Version 1.44.1
- Bug Fix: Check for presence of href during linking.

---

### September 26, 2017 // Version 1.44.0
- Reloads `members` in `inviteContactEmailAddresses` in persistence layer.

---

### September 22, 2017 // Version 1.43.0
- Add `sendEmailValidation` command to `Users`.

---

### September 21, 2017 // Version 1.42.0
- Better object compare on `linkItemWith` to allow for new objects (especially helpful
  when using Redux).

---

### September 5, 2017 // Version 1.41.0
- Reloads `contacts`, `contactEmailAddresses` and `contactPhoneNumbers`
in `saveMember` in persistence layer.

---

### August 15, 2017 // Version 1.40.0
- Updates collections to match apiv3
  - registrationLineItems -> registrationFormLineItems
  - registrationLineItemOptions -> registrationFormLineItemOptions

---

### August 14, 2017 // Version 1.39.1
- Adds types `registrationLineItems` and `registrationLineItemOptions` to `sdk.coffee`.

---

### August 8, 2017 // Version 1.39.0
- Adds `registrationLineItems` and `registrationLineItemOptions` collections.

---

### July 25, 2017 // Version 1.38.0
- Reloads `contacts` and `contactEmailAddresses` in `inviteContactEmailAddresses` in persistence layer.

---

### June 26, 2017 // Version 1.37.0
- Removes `facebookPage` from types.

---

### June 21, 2017 // Version 1.36.0
- Adds create and save methods to `invoiceTransactions` collection.

---

### June 15, 2017 // Version 1.35.0
- Adds `inviteContactEmailAddresses` method.
- Reloads `contactEmailAddresses` in `saveMemberEmailAddress` in persistence layer.

---

### May 26, 2017 // Version 1.34.0
- Adds `batchInvoiceLineItems` collection.

---

### May 23, 2017 // Version 1.33.0
- Adds `invoices` collection.
- Adds `invoiceTransactions` collection.

---

### May 19, 2017 // Version 1.32.0
- Adds `options` to `auth` method to allow for additional params in the request.
- Sets `options.optionalRequestHeaders` for TeamSnap API feature flags.

---

### May 19, 2017 // Version 1.31.0
- Handle `_teamsnapReturnCollection` flag in params for any `loadItems` method to return
entire response `collection` instead of just `items`.

---

### May 19, 2017 // Version 1.30.0
- Parse `persistentUuid` field as string in response from v3. While this is _technically_ a potentially breaking change for some, this field is mostly unusable since it is a `bigint` (and may produce values unsupported by  JS).

---

### May 12, 2017 // Version 1.29.0
- Adds `batchInvoices` collection.
- Adds `invoiceLineItems` collection.

---

### May 9, 2017 // Version 1.28.0
- Reloads `contacts` in `disableMember` in persistence layer.

---

### May 9, 2017 // Version 1.27.0
- Adds `loadDivisionAggregates` method.

---

### May 1, 2017 // Version 1.26.0
- Reloads `memberEmailAddresses`, `contactEmailAddresses`, `memberPhoneNumbers`, `contactPhoneNumbers` and `memberPreferences` in `disableMember` in persistence layer.
- Reloads `memberEmailAddresses`, `contactEmailAddresses`, `memberPhoneNumbers`, `contactPhoneNumbers` and `memberPreferences` in `invite` in persistence layer.

---

### March 29, 2017 // Version 1.25.3
- Bump minor version to publish to npm.

---

### March 29, 2017 // Version 1.25.2
- Bug fix on `eventEmitter` method.

---

### March 29, 2017 // Version 1.25.1
- Bump minor version to publish to npm.

---

### March 29, 2017 // Version 1.25.2
- Bug fix on `eventEmitter` method.

---

### March 29, 2017 // Version 1.25.0
- **BETA** Add `eventEmitter` method which allows events to be triggered while interacting with the SDK. Since this is in BETA, it is subject to change and therefore should _not_ be used in
production environments without extreme caution.

---

### March 20, 2017 // Version 1.24.0
- Add `browserLogout` method to end a session started with `startBrowserAuth`.

### February 27, 2017 // Version 1.23.2
- Bug fix that adds `sendInvites` to `importMembersFromTeam` method in persistence layer.

---

### February 24, 2017 // Version 1.23.1
- Adds `sendInvites` to `importMembersFromTeam` method.

---

### December 9, 2016 // Version 1.23.0
- Adds `loadActiveTrialDivisions` in `divisions`.

---

### November 30, 2016 // Version 1.22.0
- Adds `bulkDeleteMembers`, `divisionAdvancedLoadMembers`, and `moveMemberToTeam` in `members`.
- Adds `registrationForms` collection.
- Adds `memberRegistrationSignups` collection.

---

### November 30, 2016 // Version 1.21.3
- Fixes `EVENT_SETS` in `createBulkAssignments` error message.

---

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
