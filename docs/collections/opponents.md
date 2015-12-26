# Opponents

## Methods

- [loadOpponents](#loadOpponents)
- [createOpponent](#createOpponent)
- [saveOpponent](#saveOpponent)
- [deleteOpponent](#deleteOpponent)


---
<a id="loadOpponents"></a>
## `loadOpponents(params, callback)`
Loads items from the `opponents` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.opponents.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all opponents for `teamId: 1`.
teamsnap.loadOpponents(1);

// ~~~~~
// Loads all opponents for `contactId: 1`.
teamsnap.loadOpponents({contactId: 1});
```


---


<a id="createOpponent"></a>
## `createOpponent(data)`
Creates a new `opponent` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new opponent item.
var opponent = teamsnap.createOpponent();

// ~~~~~
// Creates a new opponent item with `name: 'Example Opponent'`.
var opponent = teamsnap.createOpponent({name: 'Example Opponent'});
```


---


<a id="saveOpponent"></a>
## `saveOpponent(opponent, callback)`
Saves an `opponent` item.

### Params
* `opponent`: [object] - opponent item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves opponent item.
teamsnap.saveOpponent(opponent);

// ~~~~~
// Creates a new opponent then saves it.
var opponent = teamsnap.createOpponent({
  teamId: 1,
  name: 'Example Opponent'
});

teamsnap.saveOpponent(opponent);
```


---


<a id="deleteOpponent"></a>
## `deleteOpponent(opponent, callback)`
Deletes an `opponent` item.

### Params
* `opponent`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a opponent item.
teamsnap.deleteOpponent(opponent);

// ~~~~~
// Creates a new opponent, saves, then deletes it.
var opponent = teamsnap.createOpponent({
  teamId: 1,
  name: 'Example Opponent'
});

teamsnap.saveOpponent(opponent).then(function(){
  // Save complete, now delete.
  teamsnap.deleteOpponent(opponent).then(function(){
    // Poof! It's gone!
  });
});
```
