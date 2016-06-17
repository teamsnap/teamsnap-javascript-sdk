# Member Photos

## Methods

- [loadMemberPhotos](#loadMemberPhotos)
- [loadMemberPhoto](#loadMemberPhoto)


---
<a id="loadMemberPhotos"></a>
## `loadMemberPhotos(params, callback)`
Loads items from the `memberPhotos` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.memberPhotos.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all memebrPhoto for `teamId: 1`.
teamsnap.loadMemberPhotos(1);

// ~~~~~
// Loads memberPhoto items for `teamId: 1` and specifies the widths to return.
teamsnap.loadMemberPhotos({teamId: 1, width: 200});
```


---

<a id="loadMemberPhoto"></a>
## `loadMemberPhoto(params, callback)`
Loads a single item from the `memberPhotos` collection based on given params.

### Params
* `params`: [int, object] - can be either a `memberPhotoId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.memberPhotos.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads a memebrPhoto for `id: 1`.
teamsnap.loadMemberPhoto(1);

// ~~~~~
// Loads a memberPhoto for `memberId: 1` and specifies the width to return.
teamsnap.loadMemberPhoto({memberId: 1, width: 200});
```
