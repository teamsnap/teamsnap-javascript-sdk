# Member Assignments

## Methods

- [loadMemberAssignments](#loadMemberAssignments)
- [createMemberAssignment](#createMemberAssignment)
- [saveMemberAssignment](#saveMemberAssignment)
- [removeMemberAssignment](#removeMemberAssignment)


---
<a id="loadMemberAssignments"></a>
## `loadMemberAssignments(params, callback)`
Loads items from the `memberAssignments` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.memberAssignments.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all `memberAssignments` for `teamId: 1`.
teamsnap.loadMemberAssignments(1);

// ~~~~~
// Loads all `memberAssignments` for `memberId: 1`.
teamsnap.loadMemberAssignments({memberId: 1});
```


---


<a id="createMemberAssignment"></a>
## `createMemberAssignment(data)`
Creates a new `memberAssignment` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new `memberAssignment` item.
var memberAssignment = teamsnap.createMemberAssignment();

// ~~~~~
// Creates a new `memberAssignment` item with `assignmentId: 1`.
var assignment = teamsnap.createAssignment({assignmentId: 1});
```


---


<a id="saveMemberAssignment"></a>
## `saveMemberAssignment(memberAssignment, callback)`
Saves a `memberAssignment` item.

### Params
* `memberAssignment`: [object] - memberAssignment item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
``` javascript
// ~~~~~
// Save `memberAsssignment` item.
teamsnap.saveMemberAssignment(memberAsssignment);
```


---


<a id="removeMemberAssignment"></a>
## `removeMemberAssignment(memberAsssignment, callback)`
Removes a member from a `memberAsssignment` item.

### Params
* `memberAssignment`: [object] - memberAssignment item to remove member from.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
``` javascript
// ~~~~~
// Remove member from `memberAsssignment` item.
teamsnap.removeMemberAssignment(memberAsssignment);
```
