# Member Files

## Methods

- [loadMemberFiles](#loadMemberFiles)
- [createMemberFile](#createMemberFile)
- [saveMemberFile](#saveMemberFile)
- [deleteMemberFile](#deleteMemberFile)
- [uploadMemberFile](#uploadMemberFile)


---
<a id="loadMemberFiles"></a>
## `loadMemberFiles(params, callback)`
Loads items from the `memberFiles` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.memberFiles.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all memberFiles for `teamId: 1`.
teamsnap.loadMemberFiles(1);

// ~~~~~
// Loads all memberFiles for `memberId: 1`.
teamsnap.loadMemberFiles({memberId: 1})
```


---


<a id="createMemberFile"></a>
## `createMemberFile(data)`
Creates a new `memberFile` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new memberFile item.
var memberFile = teamsnap.createMemberFile();

// ~~~~~
// Creates a new memberFile item with `memberId: 1` and `phoneNumber: 1`.
var memberFile = teamsnap.createMemberFile({memberId: 1});
```


---


<a id="saveMemberFile"></a>
## `saveMemberFile(memberFile, callback)`
Saves a `memberFile` item.

### Params
* `memberFile`: [object] - memberFile item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves memberFile item.
teamsnap.saveMemberFile(memberFile);
```


---


<a id="deleteMemberFile"></a>
## `deleteMemberFile(memberFile, callback)`
Deletes a `memberFile` item.

### Params
* `memberFile`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a memberFile item.
teamsnap.deleteMemberFile(memberFile);
```


---


<a id="uploadMemberFile"></a>
## `uploadMemberFile(memberFileId, file, callback)`
Uploads a file and attaches to a `memberFile` item.

### Params
* `memberFileId`: [int, object] - a memberFileId or a memberFile item to upload the file to.
* `file`: [file (object)] - file to be uploaded.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Uploads a file for a memberFile item.
teamsnap.uploadMemberFile(memberFileId, file);
```
