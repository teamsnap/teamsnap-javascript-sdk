# Contact Email Addresses

## Methods

- [loadContactEmailAddresses](#loadContactEmailAddresses)
- [createContactEmailAddress](#createContactEmailAddress)
- [saveContactEmailAddress](#saveContactEmailAddress)
- [deleteContactEmailAddress](#deleteContactEmailAddress)
- [inviteContactEmailAddresses](#inviteContactEmailAddresses)


---
<a id="loadContactEmailAddresses"></a>
## `loadContactEmailAddresses(params, callback)`
Loads items from the `contactEmailAddresses` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.contactEmailAddresses.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all contactEmailAddresses for `teamId: 1`.
teamsnap.loadContactEmailAddresses(1);

// ~~~~~
// Loads all contactEmailAddresses for `contactId: 1`.
teamsnap.loadContactEmailAddresses({contactId: 1});
```


---


<a id="createContactEmailAddress"></a>
## `createContactEmailAddress(data)`
Creates a new `contactEmailAddress` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new contactEmailAddress item.
var contactEmailAddress = teamsnap.createContactEmailAddress();

// ~~~~~
// Creates a new contactEmailAddress item with `teamId: 1` and `memberId: 1`.
var contactEmailAddress = teamsnap.createContactEmailAddress({teamId: 1, memberId: 1});
```


---


<a id="saveContactEmailAddress"></a>
## `saveContactEmailAddress(contactEmailAddress, callback)`
Saves a `contactEmailAddress` item.

### Params
* `contactEmailAddress`: [object] - contactEmailAddress item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves contactEmailAddress item.
teamsnap.saveContactEmailAddress(contactEmailAddress);

// ~~~~~
// Creates a new contactEmailAddress then saves it.
var contactEmailAddress = teamsnap.createContactEmailAddress({
  teamId: 1,
  contactId: 1,
  email: 'email@example.com',
  receivesTeamEmails: true
});

teamsnap.saveContactEmailAddress(contactEmailAddress);
```


---


<a id="deleteContactEmailAddress"></a>
## `deleteContactEmailAddress(contactEmailAddress, callback)`
Deletes a `contactEmailAddress` item.

### Params
* `contactEmailAddress`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a contactEmailAddress item.
teamsnap.deleteContactEmailAddress(contactEmailAddress);

// ~~~~~
// Creates a new contactEmailAddress, saves, then deletes it.
var contactEmailAddress = teamsnap.createContactEmailAddress({
  teamId: 1,
  contactId: 1,
  email: 'email@example.com',
  receivesTeamEmails: true
});

teamsnap.saveContactEmailAddress(contactEmailAddress).then(function(){
  // Save complete, now delete.
  teamsnap.deleteContactEmailAddress(contactEmailAddress).then(function(){
    // Poof! It's gone!
  });
});
```
<a id="inviteContactEmailAddresses"></a>
## `inviteContactEmailAddresses(params, callback)`
Invite contactEmailAddresses to a team

### Params
* `options`: [object] - Object that contains additional data:
  * `contactEmailAddressIds`: [string] A comma separated list of ids
  * `teamId`: [int] Id of Team
  * `memberId`: [int] Id of member associated with `contactEmailAddressIds`
  * `introduction`: [string] Introduction text for invitation (optional)

### Examples
```javascript
// ~~~~~
// Invites a ContactEmailAddress.
teamsnap.inviteContactEmailAddresses(params);

// ~~~~~
// Creates a new contactEmailAddress and invites it to the team.
var contactEmailAddress = teamsnap.createContactEmailAddress({
  contactId: 1,
  email: 'contact@example.com',
  receivesTeamEmails: true
});

var options = {
  contactEmailAddressIds: [1, 2, 3]
  teamId: 1,
  memberId: 2,
  notifyAsMemberId: 1,
};

teamsnap.inviteContactEmailAddresses(options).then(function() {
  // contactEmailAddress has been invited!
});
```
