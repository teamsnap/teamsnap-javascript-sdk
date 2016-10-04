# Broadcast Emails

## Methods

- [loadBroadcastEmails](#loadBroadcastEmails)
- [createBroadcastEmail](#createBroadcastEmail)
- [saveBroadcastEmail](#saveBroadcastEmail)
- [deleteBroadcastEmail](#deleteBroadcastEmail)
- [bulkDeleteBroadcastEmails](#bulkDeleteBroadcastEmails)


---
<a id="loadBroadcastEmails"></a>
## `loadBroadcastEmails(params, callback)`
Loads items from the `broadcastEmails` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.broadcastEmails.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all broadcastEmails for `teamId: 1`.
teamsnap.loadBroadcastEmails(1);

// ~~~~~
// Loads all broadcastEmails for `memberId: 1`.
teamsnap.loadBroadcastEmails({memberId: 1});
```


---


<a id="createBroadcastEmail"></a>
## `createBroadcastEmail(data)`
Creates a new `broadcastEmail` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new broadcastEmail item.
var broadcastAlert = teamsnap.createBroadcastEmail();

// ~~~~~
// Creates a new broadcastEmail item with `teamId: 1` and `memberId: 1`.
var broadcastEmail = teamsnap.createBroadcastEmail({teamId: 1, memberId: 1});
```


---


<a id="saveBroadcastEmail"></a>
## `saveBroadcastEmail(broadcastEmail, callback)`
Saves a `broadcastEmail` item.

### Params
* `broadcastEmail`: [object] - broadcastEmail item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves broadcastEmail item.
teamsnap.saveBroadcastEmail(broadcastEmail);

// ~~~~~
// Creates a new broadcastEmail then saves it.
var broadcastEmail = teamsnap.createBroadcastEmail({
  teamId: 1,
  memberId: 1,
  body: 'Example Broadcast Email'
});

teamsnap.saveBroadcastEmail(broadcastEmail);
```


---


<a id="deleteBroadcastEmail"></a>
## `deleteBroadcastEmail(broadcastEmail, callback)`
Deletes a `broadcastEmail` item.

### Params
* `broadcastEmail`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a broadcastEmail item.
teamsnap.deleteBroadcastEmail(broadcastEmail);

// ~~~~~
// Creates a new broadcastEmail, saves, then deletes it.
var broadcastEmail = teamsnap.createBroadcastEmail({
  teamId: 1,
  memberId: 1,
  body: 'Example Broadcast Email'
});

teamsnap.saveBroadcastEmail(broadcastEmail).then(function(){
  // Save complete, now delete.
  teamsnap.deleteBroadcastEmail(broadcastEmail).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="bulkDeleteBroadcastEmails"></a>
## `bulkDeleteBroadcastEmails(broadcastEmailIds, callback)`
Bulk deletes a list of `broadcastEmail` items.

### Params
* `broadcastEmailIds`: [array] - An array of broadcastEmailIds to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes multiple broadcastEmail items.
teamsnap.bulkDeleteBroadcastEmails([1,2,3])
```


---
