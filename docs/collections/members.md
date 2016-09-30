# Members

## Methods

- [loadMembers](#loadMembers)
- [createMember](#createMember)
- [saveMember](#saveMember)
- [deleteMember](#deleteMember)
- [uploadMemberPhoto](#uploadMemberPhoto)
- [removeMemberPhoto](#removeMemberPhoto)
- [generateMemberThumbnail](#generateMemberThumbnail)
- [disableMember](#disableMember)
- [memberName](#memberName)
- [getMemberSort](#getMemberSort)
- [canEditTeam](#canEditTeam)
- [canEditItem](#canEditItem)
- [importMembersFromTeam](#importMembersFromTeam)
- [loadImportableMembers](#loadImportableMembers)
- [divisionSearchMembers](#divisionSearchMembers)


---
<a id="loadMembers"></a>
## `loadMembers(params, callback)`
Loads items from the `members` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.members.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all members for `teamId: 1`.
teamsnap.loadMembers(1);

// ~~~~~
// Loads a member for `id: 1`.
teamsnap.loadMembers({id: 1});
```


---


<a id="createMember"></a>
## `createMember(data)`
Creates a new `member` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new member item.
var member = teamsnap.createMember();

// ~~~~~
// Creates a new member item with `teamId: 1`.
var member = teamsnap.createMember({teamId: 1});
```


---


<a id="saveMember"></a>
## `saveMember(member, callback)`
Saves a `member` item.

### Params
* `member`: [object] - member item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves member item.
teamsnap.saveMember(member);

// ~~~~~
// Creates a new member then saves it.
var member = teamsnap.createMember({
  teamId: 1,
  firstName: 'Andy'
});

teamsnap.saveMember(member);
```


---


<a id="deleteMember"></a>
## `deleteMember(member, callback)`
Deletes a `member` item.

### Params
* `member`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a member item.
teamsnap.deleteMember(member);

// ~~~~~
// Creates a new member, saves, then deletes it.
var member = teamsnap.createMember({
  teamId: 1,
  firstName: 'Andy'
});

teamsnap.saveMember(member).then(function(){
  // Save complete, now delete.
  teamsnap.deleteMember(member).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="uploadMemberPhoto"></a>
## `uploadMemberPhoto(memberId, file, callback)`
Command to upload a file and attach to a `member` item.

### Params
* `memberId`: [int, object] - a `memberId` or a member item to upload the file to.
* `file`: [file (object)] - file to be uploaded.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Uploads a member photo.
teamsnap.uploadMemberPhoto(memberId, file);
```


---


<a id="removeMemberPhoto"></a>
## `removeMemberPhoto(memberId, callback)`
Command to remove a member's photo.

### Params
* `memberId`: [int, object] - a `memberId` whose photo should be removed.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Removes a member photo.
teamsnap.removeMemberPhoto(memberId);
```


---


<a id="generateMemberThumbnail"></a>
## `generateMemberThumbnail(memberId, x, y, width, height, callback)`
Command to generate a thumbnail from a member's photo based on given params.

### Params
* `memberId`: [int, object] - a `memberId` of the member to generate a thumbnail from.
* `x`: [int] - `x` position to start crop.
* `y`: [int] - `y` position to start crop.
* `width`: [int] - `width` in pixels to end crop.
* `height`: [int] - `height` in pixels to end crop.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Generates a thumbnail from a member photo.
teamsnap.generateMemberThumbnail(memberId, 0, 0, 200, 200);
```


---


<a id="disableMember"></a>
## `disableMember(memberId, callback)`
Command to disable a member for a team.

### Params
* `memberId`: [int, object] - a `memberId` of a member to disable.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Disables member: `id: 1`
teamsnap.disableMember(1);
```


---


<a id="memberName"></a>
## `memberName(member, reverse, forSort)`
Given a member, it will return that member's full name.

### Params
* `member`: [object] - a member whose name should be returned.
* `reverse`: [bool] - if `true` will use "Last, First" format.
* `forSort`: [bool] - use if sorting names.

### Examples
```javascript
// ~~~~~
// Displays a member's name.
var memberName = teamsnap.memberName(member);
```


---


<a id="getMemberSort"></a>
## `getMemberSort(reverse)`
Sorts an array of members by their names.

### Params
* `reverse`: [bool] - sort in reverse order.

### Examples
```javascript
// ~~~~~
// Sorts events by date.
memberArray.sort(teamsnap.getMemberSort());
```


---


<a id="canEditTeam"></a>
## `canEditTeam(member, team)`
Returns true if a member has permission to manage a team (owner or manager).

### Params
* `member`: [object] - a `member` item to test.
* `team`: [object] - a `team` item to test against.

### Examples
```javascript
// ~~~~~
// Checks if member can edit team.
var member = {};
var team = {};
if(teamsnap.canEditTeam(member, team)){
  // Member can edit Team!
}else{
  // Noap.
}
```


---


<a id="canEditItem"></a>
## `canEditItem(member, team, item)`
Returns true if a member has write permissions for a specific item on a team.

### Params
* `member`: [object] - a `member` item to test.
* `team`: [object] - a `team` item to test against.
* `item`: [object] - an `item` item to test against.

### Examples
```javascript
// ~~~~~
// Checks if member can edit team.
var member = {};
var team = {};
var availability = {};
if(teamsnap.canEditItem(member, team, availability)){
  // Member can edit this `availability` item!
}else{
  // Getouttahere.
}
```


---


<a id="importMembersFromTeam"></a>
## `importMembersFromTeam(memberIds, teamId)`
Creates an import of members from a different team to a destination team.

## Params
* `memberIds`: [ids] - array of `memberIds` to be imported.
* `teamId`: [id, object] - `teamId` or `team.id` of team to import members to.

### Examples
```javascript
// ~~~~~
// Imports members to destination team
teamsnap.importMembersFromTeam([1, 2], 3);
```

---


<a id="loadImportableMembers"></a>
## `loadImportableMembers(userId, includeArchivedTeams)`
Creates a list of importable members by current member's userId.

## Params
* `userId`: [id] - `userId` of current member.
* `includeArchivedTeams`: [bool] - include or exclude members from archived teams (optional).

### Examples
```javascript
// ~~~~~
// Loads list of importable members by current member's userId
teamsnap.loadImportableMembers(8, true);
```


---


<a id="divisionSearchMembers"></a>
## `divisionSearchMembers(params)`
Search for members in a division.

### Params
* `params`: [object] - params to search, must include `divisionId`

### Examples
```javascript
// ~~~~~
// Return all the active members in a division
teamsnap.divisionSearchMembers({divisionId: 1, isActive: true});
```


---
