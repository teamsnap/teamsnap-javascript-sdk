# League Custom Fields

## Methods

- [loadLeagueCustomFields](#loadLeagueCustomFields)


---
<a id="loadLeagueCustomFields"></a>
## `loadLeagueCustomFields(params, callback)`
Loads items from the `leagueCustomFields` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.leagueCustomFields.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all leagueCustomFields for `teamId: 1`.
teamsnap.loadLeagueCustomFields(1);

// ~~~~~
// Loads all leagueCustomFields for `divisionId: 1`.
teamsnap.loadLeagueCustomFields({divisionId: 1});
```
