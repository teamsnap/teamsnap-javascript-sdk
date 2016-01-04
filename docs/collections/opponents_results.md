# Opponents Results

## Methods

- [loadOpponentsResults](#loadOpponentsResults)
- [loadOpponentResults](#loadOpponentResults)

---
<a id="loadOpponentsResults"></a>
## `loadOpponentsResults(params, callback)`
Loads items from the `opponentsResults` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.opponentsResults.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all opponentsResults for `teamId: 1`.
teamsnap.loadOpponentsResults(1);

// ~~~~~
// Loads an opponentResults item for `id: 1`.
teamsnap.loadOpponentsResults({id: 1});
```


---


<a id="loadOpponentResults"></a>
## `loadOpponentResults(params, callback)`
Loads a singular `opponentResults` item based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.opponentsResults.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads an opponentResults item for `id: 1`.
teamsnap.loadOpponentResults({id: 1});
```
