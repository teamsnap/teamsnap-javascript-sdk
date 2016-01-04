# League Registrant Documents

## Methods

- [loadLeagueRegistrantDocuments](#loadLeagueRegistrantDocuments)


---
<a id="loadLeagueRegistrantDocuments"></a>
## `loadLeagueRegistrantDocuments(params, callback)`
Loads items from the `leagueRegistrantDocuments` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.leagueRegistrantDocuments.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all leagueRegistrantDocuments for `teamId: 1`.
teamsnap.loadLeagueRegistrantDocuments(1);

// ~~~~~
// Loads all leagueRegistrantDocuments for `memberId: 1`.
teamsnap.loadLeagueRegistrantDocuments({memberId: 1});
```
