# Teams Statistics

## Methods

- [loadTeamStatistics](#loadTeamStatistics)


---
<a id="loadTeamStatistics"></a>
## `loadTeamStatistics(params, callback)`
Loads items from the `teamStatistics` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamStatistics.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teamStatistics for `teamId: 1`.
teamsnap.loadTeamStatistics(1);

// ~~~~~
// Loads teamStatistics for `id: 1`.
teamsnap.loadTeamStatistics({id: 1});
```
