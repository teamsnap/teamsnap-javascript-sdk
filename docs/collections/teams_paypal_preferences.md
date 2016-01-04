# Teams Paypal Preferences

## Methods

- [loadTeamsPaypalPreferences](#loadTeamsPaypalPreferences)
- [loadTeamPaypalPreferences](#loadTeamPaypalPreferences)
- [saveTeamPaypalPreferences](#saveTeamPaypalPreferences)


---
<a id="loadTeamsPaypalPreferences"></a>
## `loadTeamsPaypalPreferences(params, callback)`
Loads items from the `teamsPaypalPreferences` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamsPaypalPreferences.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teamsPaypalPreferences for `teamId: 1`.
teamsnap.loadTeamsPaypalPreferences(1);

// ~~~~~
// Loads all teamsPaypalPreferences for `id: 1`.
teamsnap.loadTeamsPaypalPreferences({id: 1});
```


---


<a id="loadTeamPaypalPreferences"></a>
## `loadTeamPaypalPreferences(params, callback)`
Loads a singular `teamPaypalPreferences` item based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamsPaypalPreferences.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads a teamPublicSite for `id: 1`.
teamsnap.loadTeamPaypalPreferences({id: 1});
```


---


<a id="saveTeamPaypalPreferences"></a>
## `saveTeamPaypalPreferences(teamPaypalPreferences, callback)`
Saves a `teamPaypalPreferences` item.

### Params
* `teamPaypalPreferences`: [object] - teamPaypalPreferences item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves a teamPaypalPreferences item.
teamsnap.saveTeamPaypalPreferences(teamPaypalPreferences);
```
