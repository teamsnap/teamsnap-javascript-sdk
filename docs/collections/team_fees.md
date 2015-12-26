# Team Fees

## Methods

- [loadTeamFees](#loadTeamFees)
- [createTeamFee](#createTeamFee)
- [saveTeamFee](#saveTeamFee)
- [deleteTeamFee](#deleteTeamFee)


---
<a id="loadTeamFees"></a>
## `loadTeamFees(params, callback)`
Loads items from the `teamFees` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamFees.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teamFees for `teamId: 1`.
teamsnap.loadTeamFees(1);

// ~~~~~
// Loads a teamFee for `id: 1`.
teamsnap.loadTeamFees({id: 1});
```


---


<a id="createTeamFee"></a>
## `createTeamFee(data)`
Creates a new `teamFee` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new teamFee item.
var teamFee = teamsnap.createTeamFee();

// ~~~~~
// Creates a new teamFee item with `teamId: 1`.
var teamFee = teamsnap.createTeamFee({teamId: 1});
```


---


<a id="saveTeamFee"></a>
## `saveTeamFee(teamFee, callback)`
Saves a `teamFee` item.

### Params
* `teamFee`: [object] - teamFee item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves teamFee item.
teamsnap.saveTeamFee(teamFee);

// ~~~~~
// Creates a new teamFee then saves it.
var teamFee = teamsnap.createTeamFee({
  teamId: 1,
  description: 'Example Team Fee',
  amount: 25
});

teamsnap.saveTeamFee(teamFee);
```


---


<a id="deleteTeamFee"></a>
## `deleteTeamFee(teamFee, callback)`
Deletes a `teamFee` item.

### Params
* `teamFee`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a teamFee item.
teamsnap.deleteTeamFee(teamFee);

// ~~~~~
// Creates a new teamFee, saves, then deletes it.
var teamFee = teamsnap.createTeamFee({
  teamId: 1,
  description: 'Example Team Fee',
  amount: 25
});

teamsnap.saveTeamFee(teamFee).then(function(){
  // Save complete, now delete.
  teamsnap.deleteTeamFee(teamFee).then(function(){
    // Poof! It's gone!
  });
});
```
