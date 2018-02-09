# Team Names

## Methods

- [loadTeamNames](#loadTeamNames)


---
<a id="loadTeamNames"></a>
## `loadTeamNames(params, callback)`
Loads items from the `teamNames` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamNames.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads a teamName for `id: 1`.
teamsnap.loadTeamNames(1);

// ~~~~~
// Loads all teamNames for `divisionId: 1`.
teamsnap.loadTeamNames({divisionId: 1});
```
