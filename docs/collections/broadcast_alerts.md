# Broadcast Alerts

## Methods

- [loadBroadcastAlerts](#loadBroadcastAlerts)
- [createBroadcastAlert](#createBroadcastAlert)
- [saveBroadcastAlert](#saveBroadcastAlert)
- [deleteBroadcastAlert](#deleteBroadcastAlert)


---
<a id="loadBroadcastAlerts"></a>
## `loadBroadcastAlerts(params, callback)`
Loads items from the `broadcastAlerts` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.broadcastAlerts.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all broadcastAlerts for `teamId: 1`.
teamsnap.loadBroadcastAlerts(1);

// ~~~~~
// Loads all broadcastAlerts for `memberId: 1`.
teamsnap.loadBroadcastAlerts({memberId: 1});
```


---


<a id="createBroadcastAlert"></a>
## `createBroadcastAlert(data)`
Creates a new `broadcastAlert` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new broadcastAlert item.
var broadcastAlert = teamsnap.createBroadcastAlert();

// ~~~~~
// Creates a new broadcastAlert item with `teamId: 1` and `memberId: 1`.
var broadcastAlert = teamsnap.createBroadcastAlert({teamId: 1, memberId: 1});
```


---


<a id="saveBroadcastAlert"></a>
## `saveBroadcastAlert(broadcastAlert, callback)`
Saves a `broadcastAlert` item.

### Params
* `broadcastAlert`: [object] - broadcastAlert item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves broadcastAlert item.
teamsnap.saveBroadcastAlert(broadcastAlert);

// ~~~~~
// Creates a new broadcastAlert then saves it.
var broadcastAlert = teamsnap.createBroadcastAlert({
  teamId: 1,
  memberId: 1,
  body: 'Example Broadcast Alert'
});

teamsnap.saveBroadcastAlert(broadcastAlert);
```


---


<a id="deleteBroadcastAlert"></a>
## `deleteBroadcastAlert(broadcastAlert, callback)`
Deletes a `broadcastAlert` item.

### Params
* `broadcastAlert`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a broadcastAlert item.
teamsnap.deleteBroadcastAlert(broadcastAlert);

// ~~~~~
// Creates a new broadcastAlert, saves, then deletes it.
var broadcastAlert = teamsnap.createBroadcastAlert({
  teamId: 1,
  memberId: 1,
  body: 'Example Broadcast Alert'
});

teamsnap.saveBroadcastAlert(broadcastAlert).then(function(){
  // Save complete, now delete.
  teamsnap.deleteBroadcastAlert(broadcastAlert).then(function(){
    // Poof! It's gone!
  });
});
```
