# Contacts

## Methods

- [loadContacts](#loadContacts)
- [createContact](#createContact)
- [saveContact](#saveContact)
- [deleteContact](#deleteContact)


---
<a id="loadContacts"></a>
## `loadContacts(params, callback)`
Loads items from the `contacts` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.contacts.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all contacts for `teamId: 1`.
teamsnap.loadContacts(1);

// ~~~~~
// Loads all contacts for `contactId: 1`.
teamsnap.loadContacts({contactId: 1});
```


---


<a id="createContact"></a>
## `createContact(data)`
Creates a new `contact` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new contact item.
var contact = teamsnap.createContact();

// ~~~~~
// Creates a new contact item with `memberId: 1` and `firstName: 'Dave'`.
var contact = teamsnap.createContact({memberId: 1, firstName: 'Andy'});
```


---


<a id="saveContact"></a>
## `saveContact(contact, callback)`
Saves a `contact` item.

### Params
* `contact`: [object] - contact item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves contact item.
teamsnap.saveContact(contact);

// ~~~~~
// Creates a new contact then saves it.
var contact = teamsnap.createContact({
  memberId: 1,
  firstName: 'Andy'
});

teamsnap.saveContact(contact);
```


---


<a id="deleteContact"></a>
## `deleteContact(contact, callback)`
Deletes a `contact` item.

### Params
* `contact`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a contact item.
teamsnap.deleteContact(contact);

// ~~~~~
// Creates a new contact, saves, then deletes it.
var contact = teamsnap.createContact({
  memberId: 1,
  firstName: 'Andy'
});

teamsnap.saveContact(contact).then(function(){
  // Save complete, now delete.
  teamsnap.deleteContact(contact).then(function(){
    // Poof! It's gone!
  });
});
```
