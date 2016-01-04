# Statistic Groups

## Methods

- [loadStatisticGroups](#loadStatisticGroups)
- [createStatisticGroup](#createStatisticGroup)
- [saveStatisticGroup](#saveStatisticGroup)
- [deleteStatisticGroup](#deleteStatisticGroup)
- [reorderStatisticGroups](#reorderStatisticGroups)


---
<a id="loadStatisticGroups"></a>
## `loadStatisticGroups(params, callback)`
Loads items from the `statisticGroups` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.statisticGroups.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all statisticGroups for `teamId: 1`.
teamsnap.loadStatisticGroups(1);

// ~~~~~
// Loads a statisticGroup for `id: 1`.
teamsnap.loadStatisticGroups({id: 1});
```


---


<a id="createStatisticGroup"></a>
## `createStatisticGroup(data)`
Creates a new `statisticGroup` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new statisticGroup item.
var statisticGroup = teamsnap.createStatisticGroup();

// ~~~~~
// Creates a new statisticGroup item with `teamId: 1`.
var statisticGroup = teamsnap.createStatisticGroup({teamId: 1});
```


---


<a id="saveStatisticGroup"></a>
## `saveStatisticGroup(statisticGroup, callback)`
Saves a `statisticGroup` item.

### Params
* `statisticGroup`: [object] - statisticGroup item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves statisticGroup item.
teamsnap.saveStatisticGroup(statisticGroup);

// ~~~~~
// Creates a new statisticGroup then saves it.
var statisticGroup = teamsnap.createStatisticGroup({
  teamId: 1,
  name: 'Example Statistic Group'
});

teamsnap.saveStatisticGroup(statisticGroup);
```


---


<a id="deleteStatisticGroup"></a>
## `deleteStatisticGroup(statisticGroup, callback)`
Deletes a `statisticGroup` item.

### Params
* `statisticGroup`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a statisticGroup item.
teamsnap.deleteStatisticGroup(statisticGroup);

// ~~~~~
// Creates a new statisticGroup, saves, then deletes it.
var statisticGroup = teamsnap.createStatisticGroup({
  teamId: 1,
  name: 'Example Statistic Group'
});

teamsnap.saveStatisticGroup(statisticGroup).then(function(){
  // Save complete, now delete.
  teamsnap.deleteStatisticGroup(statisticGroup).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="reorderStatisticGroups"></a>
## `reorderStatisticGroups(teamId, statisticGroupIds, callback)`
Command to reorder `statisticGroup` items based on an array of `statisticGroupIds`.

### Params
* `teamId`: [int] - a `teamId`.
* `statisticGroupIds`: [array] - an array of sorted `statisticGroupId`s.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Reorders a statisticGroup item.
teamsnap.reorderStatisticGroups(1, [3,1,2]);
```
