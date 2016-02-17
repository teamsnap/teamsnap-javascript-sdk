# Member Email Addresses

## Methods

- [loadMemberEmailAddresses](#loadMemberEmailAddresses)
- [createMemberEmailAddress](#createMemberEmailAddress)
- [saveMemberEmailAddress](#saveMemberEmailAddress)
- [deleteMemberEmailAddress](#deleteMemberEmailAddress)
- [inviteMemberEmailAddresses](#inviteMemberEmailAddresses)


---
<a id="loadMemberEmailAddresses"></a>
## `loadMemberEmailAddresses(params, callback)`
Loads items from the `memberEmailAddresss` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.memberEmailAddresss.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all memberEmailAddresss for `teamId: 1`.
teamsnap.loadMemberEmailAddresses(1);

// ~~~~~
// Loads all memberEmailAddresss for `memberId: 1`.
teamsnap.loadMemberEmailAddresses({memberId: 1});
```


---


<a id="createMemberEmailAddress"></a>
## `createMemberEmailAddress(data)`
Creates a new `memberEmailAddress` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new memberEmailAddress item.
var memberEmailAddress = teamsnap.createMemberEmailAddress();

// ~~~~~
// Creates a new memberEmailAddress item with `memberId: 1` and `phoneNumber: 1`.
var memberEmailAddress = teamsnap.createMemberEmailAddress({memberId: 1});
```


---


<a id="saveMemberEmailAddress"></a>
## `saveMemberEmailAddress(memberEmailAddress, callback)`
Saves a `memberEmailAddress` item.

### Params
* `memberEmailAddress`: [object] - memberEmailAddress item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves memberEmailAddress item.
teamsnap.saveMemberEmailAddress(memberEmailAddress);

// ~~~~~
// Creates a new memberEmailAddress then saves it.
var memberEmailAddress = teamsnap.createMemberEmailAddress({
  memberId: 1,
  email: 'member@example.com',
  receivesTeamEmails: true
});

teamsnap.saveMemberEmailAddress(memberEmailAddress);
```


---


<a id="deleteMemberEmailAddress"></a>
## `deleteMemberEmailAddress(memberEmailAddress, callback)`
Deletes a `memberEmailAddress` item.

### Params
* `memberEmailAddress`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a memberEmailAddress item.
teamsnap.deleteMemberEmailAddress(memberEmailAddress);

// ~~~~~
// Creates a new memberEmailAddress, saves, then deletes it.
var memberEmailAddress = teamsnap.createMemberEmailAddress({
  memberId: 1,
  email: 'member@example.com',
  receivesTeamEmails: true
});

teamsnap.saveMemberEmailAddress(memberEmailAddress).then(function(){
  // Save complete, now delete.
  teamsnap.deleteMemberEmailAddress(memberEmailAddress).then(function(){
    // Poof! It's gone!
  });
});
```
<a id="inviteMemberEmailAddresses"></a>
## `inviteMemberEmailAddresses(params, callback)`
Invite memberEmailAddresses to a team

### Params
* `options`: [object] - Object that contains additional data:
  * `memberEmailAddressIds`: [string] A comma separated list of ids
  * `teamId`: [int] Id of Team
  * `memberId`: [int] Id of member associated with `memberEmailAddressIds`
  * `notifyAsMemberId`: [int] Id of member sending invitation
  * `introduction`: [string] Introduction text for invitation (optional)

### Examples
```javascript
// ~~~~~
// Invites a MemberEmailAddress.
teamsnap.inviteMemberEmailAddresses(params);

// ~~~~~
// Creates a new memberEmailAddress and invites it to the team. 
var memberEmailAddress = teamsnap.createMemberEmailAddress({
  memberId: 1,
  email: 'member@example.com',
  receivesTeamEmails: true
});

var options = {
  memberEmailAddressIds: "'" + memberEmailAddress.id + "'"
  teamId: 1,
  memberId: 2,
  notifyAsMemberId: 1,
  introduction: "Welcome to the team!"
};

teamsnap.inviteMemberEmailAddresses(options).then(function() {
  // memberEmailAddress has been invited!
});
```
