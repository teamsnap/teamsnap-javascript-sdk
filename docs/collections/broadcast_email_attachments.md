# Broadcast Email Attachments

## Methods

- [loadBroadcastEmailAttachments](#loadBroadcastEmailAttachments)
- [deleteBroadcastEmailAttachment](#deleteBroadcastEmailAttachment)
- [uploadBroadcastEmailAttachment](#uploadBroadcastEmailAttachment)


---
<a id="loadBroadcastEmailAttachments"></a>
## `loadBroadcastEmailAttachments(params, callback)`
Loads items from the `broadcastEmailAttachments` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.broadcastEmailAttachments.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all broadcastEmailAttachments for `teamId: 1`.
teamsnap.loadBroadcastEmailAttachments(1);

// ~~~~~
// Loads all broadcastEmailAttachments for `memberId: 1`.
teamsnap.loadBroadcastEmailAttachments({memberId: 1});
```


---


<a id="deleteBroadcastEmailAttachment"></a>
## `deleteBroadcastEmailAttachment(broadcastEmailAttachment, callback)`
Deletes a `broadcastEmailAttachment` item.

### Params
* `broadcastEmailAttachment`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a broadcastEmailAttachment item.
teamsnap.deleteBroadcastEmailAttachment(broadcastEmailAttachment);
```


---


<a id="uploadBroadcastEmailAttachment"></a>
## `uploadBroadcastEmailAttachment(broadcastEmailId, memberId, file, progressCallback, callback)`
Uploads a broadcastEmailAttachment file.

### Params
* `broadcastEmailId`: [int] - id of a `broadcastEmail` item the file is attached to.
* `memberId`: [int] - `memberId` of `broadcastEmail` sender.
* `file`: [file (object)] - file to be attached.
* `progressCallback`: [function] - method to be called when when `onprogress` event is triggered.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Uploads a file as a broadcastEmailAttachment.
var fileObject; // File object from a file input.
var progressHandler = function(progress){
  console.log((progress.loaded / progress.total) + ' loaded!');
}
teamsnap.uploadBroadcastEmailAttachment(1,1, fileObject, progressHandler);
```
