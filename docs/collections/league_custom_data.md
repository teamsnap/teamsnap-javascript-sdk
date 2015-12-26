# Contact Phone Numbers

## Methods

- [loadLeagueCustomData](#loadLeagueCustomData)
- [createLeagueCustomDatum](#createLeagueCustomDatum)
- [saveLeagueCustomDatum](#saveLeagueCustomDatum)


---
<a id="loadLeagueCustomData"></a>
## `loadLeagueCustomData(params, callback)`
Loads items from the `leagueCustomData` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.leagueCustomData.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all leagueCustomData for `teamId: 1`.
teamsnap.loadLeagueCustomData(1);

// ~~~~~
// Loads all leagueCustomData for `leagueCustomFieldId: 1`.
teamsnap.loadLeagueCustomData({leagueCustomFieldId: 1});
```


---


<a id="createLeagueCustomDatum"></a>
## `createLeagueCustomDatum(data)`
Creates a new `leagueCustomDatum` item.
Note _

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new leagueCustomDatum item.
var leagueCustomDatum = teamsnap.createLeagueCustomDatum();

// ~~~~~
// Creates a new leagueCustomDatum item with `leagueCustomFieldId: 1`.
var leagueCustomDatum = teamsnap.createLeagueCustomDatum({leagueCustomFieldId: 1});
```


---


<a id="saveLeagueCustomDatum"></a>
## `saveLeagueCustomDatum(leagueCustomDatum, callback)`
Saves a `leagueCustomDatum` item.

### Params
* `leagueCustomDatum`: [object] - leagueCustomDatum item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves leagueCustomDatum item.
teamsnap.saveLeagueCustomDatum(leagueCustomDatum);

// ~~~~~
// Creates a new leagueCustomDatum then saves it.
var leagueCustomDatum = teamsnap.createLeagueCustomDatum({
  leagueCustomFieldId: 1,
  value: 'Example!'
});

teamsnap.saveLeagueCustomDatum(leagueCustomDatum);
```
