# Team Media

## Methods

- [loadTeamMedia](#loadTeamMedia)
- [createTeamMedium](#createTeamMedium)
- [saveTeamMedium](#saveTeamMedium)
- [deleteTeamMedium](#deleteTeamMedium)
- [uploadTeamMedium](#uploadTeamMedium)
- [reorderTeamMedia](#reorderTeamMedia)
- [saveTeamVideoLink](#saveTeamVideoLink)
- [bulkDeleteTeamMedia](#bulkDeleteTeamMedia)
- [assignMediaToGroup](#assignMediaToGroup)
- [rotateTeamMediumImage](#rotateTeamMediumImage)
- [setMediumAsTeamPhoto](#setMediumAsTeamPhoto)
- [setMediumAsMemberPhoto](#setMediumAsMemberPhoto)
- [facebookShareTeamMedium](#facebookShareTeamMedium)


---
<a id="loadTeamMedia"></a>
## `loadTeamMedia(params, callback)`
Loads items from the `teamMedia` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamMedia.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teamMedia for `teamId: 1`.
teamsnap.loadTeamMedia(1);

// ~~~~~
// Loads a teamMedium for `id: 1`.
teamsnap.loadTeamMedia({id: 1});
```


---


<a id="createTeamMedium"></a>
## `createTeamMedium(data)`
Creates a new `teamMedium` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new teamMedium item.
var teamMedium = teamsnap.createTeamMedium();

// ~~~~~
// Creates a new teamMedium item with `teamId: 1`.
var teamMedium = teamsnap.createTeamMedium({teamId: 1});
```


---


<a id="saveTeamMedium"></a>
## `saveTeamMedium(teamMedium, callback)`
Saves a `teamMedium` item.

_Note: Attaching actual media to `teamMedia` items is done via commands (see `uploadTeamMedium` and `createTeamVideoLink`) - this is used to update the media details._

### Params
* `teamMedium`: [object] - teamMedium item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves teamMedium item.
teamsnap.saveTeamMedium(teamMedium);
```


---


<a id="deleteTeamMedium"></a>
## `deleteTeamMedium(teamMedium, callback)`
Deletes a `teamMedium` item.

### Params
* `teamMedium`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a teamMedium item.
teamsnap.deleteTeamMedium(teamMedium);
```


---


<a id="reorderTeamMedia"></a>
## `reorderTeamMedia(teamId, teamMediumIds, callback)`
Command to reorder `teamMedium` items based on an array of `teamMediumIds`.

### Params
* `teamId`: [int] - a `teamId`.
* `teamMediumIds`: [array] - an array of sorted `teamMediumId`s.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Reorders teamMedium items.
teamsnap.reorderTeamMedia(1, [3,1,2]);
```


---


<a id="saveTeamVideoLink"></a>
## `saveTeamVideoLink(teamMedium, callback)`
Command to create `teamMedium` item with a video link (uses `mediaFormat: video`)

### Params
* `teamMedium`: [object] - a `teamMedium` item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Creates and then saves a team video link.
var teamMedium = teamsnap.createTeamMedium({
  teamId: 1,
  teamMediaGroupId: 1,
  mediaFormat: 'video',
  description: 'Example Video',
  videoUrl: 'https://www.youtube.com/watch?v=fx0vRXYGijU'
});

teamsnap.saveTeamVideoLink(teamMedium);
```


---


<a id="bulkDeleteTeamMedia"></a>
## `bulkDeleteTeamMedia(teamMediumIds, callback)`
Command to delete multiple `teamMedium` items based on an array of `teamMediumIds`.

### Params
* `teamMediumIds`: [array] - an array of `teamMediumId`s of the teamMedia to delete.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes multiple teamMedium items at once.
teamsnap.bulkDeleteTeamMedia([1,2,3]);
```


---


<a id="assignMediaToGroup"></a>
## `assignMediaToGroup(teamMediumIds, teamMediaGroupId, callback)`
Command to assign multiple `teamMedium` items to a `teamMediaGroup`.

### Params
* `teamMediumIds`: [array] - an array of `teamMediumId`s of the teamMedia to assign.
* `teamMediaGroupId`: [int] - callback to be executed when the operation
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Assign some teamMedia to `teamMediaGroupId: 1`
teamsnap.assignMediaToGroup([1,2,3],1);
```


---


<a id="rotateTeamMediumImage"></a>
## `rotateTeamMediumImage(teamMediumId, rotateDirection, callback)`
Command to rotate a `teamMedium` image based on the provided `rotateDirection`

### Params
* `teamMediumId`: [int] - a `teamIdMediumId` of an image.
* `rotateDirection`: [string] - direction to rotate - either `clockwise` or `counterclockwise`
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Rotates a teamMedium image.
teamsnap.rotateTeamMediumImage(1, 'clockwise');
```


---


<a id="setMediumAsTeamPhoto"></a>
## `setMediumAsTeamPhoto(teamMediumId, callback)`
Command to set `teamMedium` as team photo.

### Params
* `teamMediumId`: [int] - `teamMediumId` of the image to set.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Sets a teamMedium as team photo.
teamsnap.setMediumAsTeamPhoto(1);
```


---


<a id="setMediumAsMemberPhoto"></a>
## `setMediumAsMemberPhoto(teamMediumId, memberId, callback)`
Command to set `teamMedium` as team photo.

### Params
* `teamMediumId`: [int] - `teamMediumId` of the image to set.
* `memberId`: [int] - `memberId` of the member to set the image on.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Sets a teamMedium as photo for `memberId: 1`
teamsnap.setMediumAsMemberPhoto(1, 1);
```


---


<a id="facebookShareTeamMedium"></a>
## `facebookShareTeamMedium(teamMediumId, facebookPageId, isSuppressedFromFeed, caption, callback)`
Command to share a `teamMedium` to a Facebook page your user manages.

_Note: You must have your Facebook page connected to your user account, and then you can use the `teamsnap.loadFacebookPages()` method to retrieve a list of available Facebook Page ids._

### Params
* `teamMediumId`: [int] - `teamMediumId` of image to share.
* `facebookPageId`: [int] - Facebook Page ID of a page you manage.
* `isSuppressedFromFeed`: [bool] - set to `true` to hide from Facebook Feed; `false` shows it.
* `caption`: [text, null] - Caption for the photo.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Shares a teamMedium (image) on Facebook.
teamsnap.facebookShareTeamMedium(1, 123456789, false, 'Photo sharing example!');
```
