# Division Team Standings

## Methods

- [loadDivisionTeamStandings](#loadDivisionTeamStandings)


---
<a id="loadDivisionTeamStandings"></a>
## `loadDivisionTeamStandings(params, callback)`
Loads items from the `divisionTeamStandings` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisionTeamStandings.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all divisionTeamStandings for `teamId: 1`.
teamsnap.loadDivisionTeamStandings(1);
```
