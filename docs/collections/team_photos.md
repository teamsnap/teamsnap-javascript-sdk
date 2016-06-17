# Team Photos

## Methods

- [loadTeamPhotos](#loadTeamPhotos)
- [loadTeamPhoto](#loadTeamPhoto)


---
<a id="loadTeamPhotos"></a>
## `loadTeamPhotos(params, callback)`
Loads items from the `teamPhotos` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.loadTeamPhotos.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teamPhotos for `teamId: 1`.
teamsnap.loadTeamPhotos(1);

// ~~~~~
// Loads teamPhoto items for `teamId: 1` and specifies the widths to return.
teamsnap.loadTeamPhotos({teamId: 1, width: 200});
```


---

<a id="loadTeamPhoto"></a>
## `loadTeamPhoto(params, callback)`
Loads a single item from the `teamPhotos` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamPhotoId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.loadTeamPhotos.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads a teamPhoto for `id: 1`.
teamsnap.loadTeamPhoto(1);

// ~~~~~
// Loads a teamPhoto for `teamId: 1` and specifies the width to return.
teamsnap.loadTeamPhoto({teamId: 1, width: 200});
```
