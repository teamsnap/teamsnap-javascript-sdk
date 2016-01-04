# Contact Email Addresses

## Methods

- [loadContactEmailAddresses](#loadContactEmailAddresses)
- [createContactEmailAddress](#createContactEmailAddress)
- [saveContactEmailAddress](#saveContactEmailAddress)
- [deleteContactEmailAddress](#deleteContactEmailAddress)


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
