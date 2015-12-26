# Tracked Item Statuses

## Methods

- [loadTrackedItemStatuses](#loadTrackedItemStatuses)
- [saveTrackedItemStatus](#saveTrackedItemStatus)


---
<a id="loadTrackedItemStatuses"></a>
## `loadTrackedItemStatuses(params, callback)`
Loads items from the `trackedItemStatuses` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.trackedItemStatuses.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all trackedItemStatuses for `teamId: 1`.
teamsnap.loadTrackedItemStatuses(1);

// ~~~~~
// Loads a trackedItemStatus for `id: 1`.
teamsnap.loadTrackedItemStatuses({id: 1});
```


---


<a id="saveTrackedItemStatus"></a>
## `saveTrackedItemStatus(trackedItemStatus, callback)`
Saves a `trackedItemStatus` item.

### Params
* `trackedItemStatus`: [object] - trackedItemStatus item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves trackedItemStatus item.
teamsnap.saveTrackedItemStatus(trackedItemStatus);
```
