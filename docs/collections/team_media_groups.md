# Team Media Groups

## Methods

- [loadTeamMediaGroups](#loadTeamMediaGroups)
- [createTeamMediaGroup](#createTeamMediaGroup)
- [saveTeamMediaGroup](#saveTeamMediaGroup)
- [deleteTeamMediaGroup](#deleteTeamMediaGroup)
- [reorderTeamMediaGroups](#reorderTeamMediaGroups)


---
<a id="loadTeamMediaGroups"></a>
## `loadTeamMediaGroups(params, callback)`
Loads items from the `teamMediaGroups` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamMediaGroups.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teamMediaGroups for `teamId: 1`.
teamsnap.loadTeamMediaGroups(1);

// ~~~~~
// Loads a teamMediaGroup for `id: 1`.
teamsnap.loadTeamMediaGroups({id: 1});
```


---


<a id="createTeamMediaGroup"></a>
## `createTeamMediaGroup(data)`
Creates a new `teamMediaGroup` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new teamMediaGroup item.
var teamMediaGroup = teamsnap.createTeamMediaGroup();

// ~~~~~
// Creates a new teamMediaGroup item with `teamId: 1`.
var teamMediaGroup = teamsnap.createTeamMediaGroup({teamId: 1});
```


---


<a id="saveTeamMediaGroup"></a>
## `saveTeamMediaGroup(teamMediaGroup, callback)`
Saves a `teamMediaGroup` item.

### Params
* `teamMediaGroup`: [object] - teamMediaGroup item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves teamMediaGroup item.
teamsnap.saveTeamMediaGroup(teamMediaGroup);

// ~~~~~
// Creates a new teamMediaGroup then saves it.
var teamMediaGroup = teamsnap.createTeamMediaGroup({
  teamId: 1,
  mediaFormat: 'file'
  name: 'Example Team Media Group'
});

teamsnap.saveTeamMediaGroup(teamMediaGroup);
```


---


<a id="deleteTeamMediaGroup"></a>
## `deleteTeamMediaGroup(teamMediaGroup, callback)`
Deletes a `teamMediaGroup` item.

### Params
* `teamMediaGroup`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a teamMediaGroup item.
teamsnap.deleteTeamMediaGroup(teamMediaGroup);

// ~~~~~
// Creates a new teamMediaGroup, saves, then deletes it.
var teamMediaGroup = teamsnap.createTeamMediaGroup({
  teamId: 1,
  mediaFormat: 'file'
  name: 'Example Team Media Group'
});

teamsnap.saveTeamMediaGroup(teamMediaGroup).then(function(){
  // Save complete, now delete.
  teamsnap.deleteTeamMediaGroup(teamMediaGroup).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="reorderTeamMediaGroups"></a>
## `reorderTeamMediaGroups(teamId, teamMediaGroupIds, callback)`
Command to reorder `teamMediaGroup` items based on an array of `teamMediaGroupIds`.

### Params
* `teamId`: [object] - a `teamId`.
* `teamMediaGroupIds`: [array] - an array of sorted `teamMediaGroupId`s.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Reorders teamMediaGroup items.
teamsnap.reorderTeamMediaGroups(1, [3,1,2]);
```
