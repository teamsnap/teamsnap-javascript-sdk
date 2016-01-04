# Statistics

## Methods

- [loadStatistics](#loadStatistics)
- [createStatistic](#createStatistic)
- [saveStatistic](#saveStatistic)
- [deleteStatistic](#deleteStatistic)
- [reorderStatistics](#reorderStatistics)


---
<a id="loadStatistics"></a>
## `loadStatistics(params, callback)`
Loads items from the `statistics` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.statistics.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all statistics for `teamId: 1`.
teamsnap.loadStatistics(1);

// ~~~~~
// Loads a statistic for `id: 1`.
teamsnap.loadStatistics({id: 1});
```


---


<a id="createStatistic"></a>
## `createStatistic(data)`
Creates a new `statistic` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new statistic item.
var statistic = teamsnap.createStatistic();

// ~~~~~
// Creates a new statistic item with `teamId: 1`.
var statistic = teamsnap.createStatistic({teamId: 1});
```


---


<a id="saveStatistic"></a>
## `saveStatistic(statistic, callback)`
Saves a `statistic` item.

### Params
* `statistic`: [object] - statistic item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves statistic item.
teamsnap.saveStatistic(statistic);

// ~~~~~
// Creates a new statistic then saves it.
var statistic = teamsnap.createStatistic({
  teamId: 1,
  name: 'Example Statistic'
});

teamsnap.saveStatistic(statistic);
```


---


<a id="deleteStatistic"></a>
## `deleteStatistic(statistic, callback)`
Deletes a `statistic` item.

### Params
* `statistic`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a statistic item.
teamsnap.deleteStatistic(statistic);

// ~~~~~
// Creates a new statistic, saves, then deletes it.
var statistic = teamsnap.createStatistic({
  teamId: 1,
  name: 'Example Statistic'
});

teamsnap.saveStatistic(statistic).then(function(){
  // Save complete, now delete.
  teamsnap.deleteStatistic(statistic).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="reorderStatistics"></a>
## `reorderStatistics(teamId, statisticIds, callback)`
Command to reorder `statistic` items based on an array of `statisticIds`.

### Params
* `teamId`: [object] - a `teamId`.
* `statisticIds`: [array] - an array of sorted `statisticId`s.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Reorders statistic items.
teamsnap.reorderStatistics(1, [3,1,2]);
```
