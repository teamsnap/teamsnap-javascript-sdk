# Teams Results

## Methods

- [loadTeamsResults](#loadTeamsResults)
- [loadTeamResults](#loadTeamResults)



---
<a id="loadTeamsResults"></a>
## `loadTeamsResults(params, callback)`
Loads items from the `teamsResults` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamsResults.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teamsResults for `teamId: 1`.
teamsnap.loadTeamsResults(1);

// ~~~~~
// Loads teamResults for `id: 1`.
teamsnap.loadTeamsResults({id: 1});
```


---


<a id="loadTeamResults"></a>
## `loadTeamsResults(params, callback)`
Loads a singular `teamResults` item based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamsResults.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads teamResults for `id: 1`.
teamsnap.loadTeamResults({id: 1});
```
