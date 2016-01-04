# Contact Phone Numbers

## Methods

- [loadContactPhoneNumbers](#loadContactPhoneNumbers)
- [createContactPhoneNumber](#createContactPhoneNumber)
- [saveContactPhoneNumber](#saveContactPhoneNumber)
- [deleteContactPhoneNumber](#deleteContactPhoneNumber)


---
<a id="loadContactPhoneNumbers"></a>
## `loadContactPhoneNumbers(params, callback)`
Loads items from the `contactPhoneNumbers` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.contactPhoneNumbers.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all contactPhoneNumbers for `teamId: 1`.
teamsnap.loadContactPhoneNumbers(1);

// ~~~~~
// Loads all contactPhoneNumbers for `contactId: 1`.
teamsnap.loadContactPhoneNumbers({contactId: 1});
```


---


<a id="createContactPhoneNumber"></a>
## `createContactPhoneNumber(data)`
Creates a new `contactPhoneNumber` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new contactPhoneNumber item.
var contactPhoneNumber = teamsnap.createContactPhoneNumber();

// ~~~~~
// Creates a new contactPhoneNumber item with `contactId: 1` and `phoneNumber: '1231231234'`.
var contactPhoneNumber = teamsnap.createContactPhoneNumber({contactId: 1, phoneNumber: '1231231234'});
```


---


<a id="saveContactPhoneNumber"></a>
## `saveContactPhoneNumber(contactPhoneNumber, callback)`
Saves a `contactPhoneNumber` item.

### Params
* `contactPhoneNumber`: [object] - contactPhoneNumber item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves contactPhoneNumber item.
teamsnap.saveContactPhoneNumber(contactPhoneNumber);

// ~~~~~
// Creates a new contactPhoneNumber then saves it.
var contactPhoneNumber = teamsnap.createContactPhoneNumber({
  contactId: 1,
  phoneNumber: '1231231234'
});

teamsnap.saveContactPhoneNumber(contactPhoneNumber);
```


---


<a id="deleteContactPhoneNumber"></a>
## `deleteContactPhoneNumber(contactPhoneNumber, callback)`
Deletes a `contactPhoneNumber` item.

### Params
* `contactPhoneNumber`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a contactPhoneNumber item.
teamsnap.deleteContactPhoneNumber(contactPhoneNumber);

// ~~~~~
// Creates a new contactPhoneNumber, saves, then deletes it.
var contactPhoneNumber = teamsnap.createContactPhoneNumber({
  contactId: 1,
  phoneNumber: '1231231234'
});

teamsnap.saveContactPhoneNumber(contactPhoneNumber).then(function(){
  // Save complete, now delete.
  teamsnap.deleteContactPhoneNumber(contactPhoneNumber).then(function(){
    // Poof! It's gone!
  });
});
```
