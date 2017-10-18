# Team Stores

## Methods

- [loadTeamStores](#loadTeamStores)


---
<a id="loadTeamStores"></a>
## `loadTeamStores(params, callback)`
Loads items from the `teamStores` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.


### Examples
```javascript
// ~~~~~
// Loads all teamStores for `teamId: 1`.
teamsnap.loadTeamStores(1);

// ~~~~~
// Loads teamStores for `id: 1`.
teamsnap.loadAvailabilities({id: 1});
```
