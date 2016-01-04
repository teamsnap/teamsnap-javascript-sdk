# Statistic Data

## Methods

- [loadStatisticData](#loadStatisticData)
- [createStatisticDatum](#createStatisticDatum)
- [saveStatisticDatum](#saveStatisticDatum)
- [deleteStatisticDatum](#deleteStatisticDatum)


---
<a id="loadStatisticData"></a>
## `loadStatisticData(params, callback)`
Loads items from the `statisticData` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.statisticData.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all statisticData for `teamId: 1`.
teamsnap.loadStatisticData(1);

// ~~~~~
// Loads all statisticData for `memberId: 1`.
teamsnap.loadStatisticData({memberId: 1});
```


---


<a id="createStatisticDatum"></a>
## `createStatisticDatum(data)`
Creates a new `statisticDatum` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new statisticDatum item.
var statisticDatum = teamsnap.createStatisticDatum();

// ~~~~~
// Creates a new statisticDatum item with `statisticId: 1`.
var statisticDatum = teamsnap.createStatisticDatum({statisticId: 1});
```


---


<a id="saveStatisticDatum"></a>
## `saveStatisticDatum(statisticDatum, callback)`
Saves a `statisticDatum` item.

### Params
* `statisticDatum`: [object] - statisticDatum item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves statisticDatum item.
teamsnap.saveStatisticDatum(statisticDatum);

// ~~~~~
// Creates a new statisticDatum then saves it.
var statisticDatum = teamsnap.createStatisticDatum({
  teamId: 1,
  statisticId: 1,
  eventId: 1,
  value: 1
});

teamsnap.saveStatisticDatum(statisticDatum);
```


---


<a id="deleteStatisticDatum"></a>
## `deleteStatisticDatum(statisticDatum, callback)`
Deletes a `statisticDatum` item.

### Params
* `statisticDatum`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a statisticDatum item.
teamsnap.deleteStatisticDatum(statisticDatum);

// ~~~~~
// Creates a new statisticDatum, saves, then deletes it.
var statisticDatum = teamsnap.createStatisticDatum({
  teamId: 1,
  statisticId: 1,
  eventId: 1,
  value: 1
});

teamsnap.saveStatisticDatum(statisticDatum).then(function(){
  // Save complete, now delete.
  teamsnap.deleteStatisticDatum(statisticDatum).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="bulkSaveStatisticData"></a>
## `bulkSaveStatisticData(templates, callback)`
Command for saving multiple `statisticDatum` items at once.

### Params
* `templates`: [string] - Stringified array of statisticDatum templates.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves statisticDatum item.
teamsnap.bulkSaveStatisticData(templates);
```


---


<a id="bulkDeleteStatisticData"></a>
## `bulkSaveStatisticData(member, event, callback)`
Command for deleting all `statisticDatum` items related to a given member and event.

### Params
* `member`: [object] - member object for statisticData to delete.
* `event`: [object] - event object for statisticData to delete.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves bulkDeleteStatisticData item.
teamsnap.bulkDeleteStatisticData(member, event);
```
