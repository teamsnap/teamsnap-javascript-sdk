# Sports

## Methods

- [loadSports](#loadSports)
- [loadSport](#loadSport)

---
<a id="loadSports"></a>
## `loadSports(params, callback)`
Loads items from the `sports` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.sports.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all sports for `teamId: 1`.
teamsnap.loadSports(1);

// ~~~~~
// Loads sport for `id: 1`.
teamsnap.loadSports({id: 1});
```


---

<a id="loadSport"></a>
## `loadSport(teamId, callback)`
Loads a singular `sport` item based on given params.

### Params
* `teamId`: [int] - a `teamId`.
* `callback`: [function] - callback to be executed when the operation completes.
`

### Examples
```javascript
// ~~~~~
// Loads sport for `teamId: 1`.
teamsnap.loadSport(1);
```
