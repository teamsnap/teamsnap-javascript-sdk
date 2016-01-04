# Tracked Items

## Methods

- [loadTrackedItems](#loadTrackedItems)
- [createTrackedItem](#createTrackedItem)
- [saveTrackedItem](#saveTrackedItem)
- [deleteTrackedItem](#deleteTrackedItem)


---
<a id="loadTrackedItems"></a>
## `loadTrackedItems(params, callback)`
Loads items from the `trackedItems` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.trackedItems.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all trackedItems for `teamId: 1`.
teamsnap.loadTrackedItems(1);

// ~~~~~
// Loads a trackedItem for `id: 1`.
teamsnap.loadTrackedItems({id: 1});
```


---


<a id="createTrackedItem"></a>
## `createTrackedItem(data)`
Creates a new `trackedItem` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new trackedItem item.
var trackedItem = teamsnap.createTrackedItem();

// ~~~~~
// Creates a new trackedItem item with `teamId: 1`.
var trackedItem = teamsnap.createTrackedItem({teamId: 1});
```


---


<a id="saveTrackedItem"></a>
## `saveTrackedItem(trackedItem, callback)`
Saves a `trackedItem` item.

### Params
* `trackedItem`: [object] - trackedItem item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves trackedItem item.
teamsnap.saveTrackedItem(trackedItem);

// ~~~~~
// Creates a new trackedItem then saves it.
var trackedItem = teamsnap.createTrackedItem({
  teamId: 1,
  name: 'Example Tracked Item'
});

teamsnap.saveTrackedItem(trackedItem);
```


---


<a id="deleteTrackedItem"></a>
## `deleteTrackedItem(trackedItem, callback)`
Deletes a `trackedItem` item.

### Params
* `trackedItem`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a trackedItem item.
teamsnap.deleteTrackedItem(trackedItem);

// ~~~~~
// Creates a new trackedItem, saves, then deletes it.
var trackedItem = teamsnap.createTrackedItem({
  teamId: 1,
  name: 'Example Tracked Item'
});

teamsnap.saveTrackedItem(trackedItem).then(function(){
  // Save complete, now delete.
  teamsnap.deleteTrackedItem(trackedItem).then(function(){
    // Poof! It's gone!
  });
});
```
