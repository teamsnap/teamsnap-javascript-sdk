# Assignments

## Methods

- [loadAssignments](#loadAssignments)
- [createAssignment](#createAssignment)
- [saveAssignment](#saveAssignment)
- [deleteAssignment](#deleteAssignment)
- [getAssignmentSort](#getAssignmentSort)
- [sendAssignmentEmails](#sendAssignmentEmails)
- [reorderAssignments](#reorderAssignments)
- [createBulkAssignments](#createBulkAssignments)


---
<a id="loadAssignments"></a>
## `loadAssignments(params, callback)`
Loads items from the `assignments` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.assignments.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all `assignments` for `teamId: 1`.
teamsnap.loadAssignments(1);

// ~~~~~
// Loads all `assignments` for `memberId: 1`.
teamsnap.loadAssignments({memberId: 1});
```


---


<a id="createAssignment"></a>
## `createAssignment(data)`
Creates a new `assignment` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new `assignment` item.
var assignment = teamsnap.createAssignment();

// ~~~~~
// Creates a new `assignment` item with `memberId: 1` and `eventId: 1`.
var assignment = teamsnap.createAssignment({memberId: 1, eventId: 1});
```


---


<a id="saveAssignment"></a>
## `saveAssignment(assignment, callback)`
Saves an `assignment` item.

### Params
* `assignment`: [object] - assignment item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves `assignment` item.
teamsnap.saveAssignment(assignment);

// ~~~~~
// Creates a new `assignment` then saves it.
var assignment = teamsnap.createAssignment({
  teamId: 1,
  memberId: 1,
  eventId: 1,
  description: 'Example Assignment'
});

teamsnap.saveAssignment(assignment);
```


---


<a id="deleteAssignment"></a>
## `deleteAssignment(assignment, callback)`
Deletes an `assignment` item.

### Params
* `assignment`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes an `assignment` item.
teamsnap.deleteAssignment(assignment);

// ~~~~~
// Creates a new `assignment` item, saves, then deletes it.
var assignment = teamsnap.createAssignment({
  teamId: 1,
  memberId: 1,
  eventId: 1,
  description: 'Example Assignment'
});

teamsnap.saveAssignment(assignment).then(function(){
  // Save complete, now delete.
  teamsnap.deleteAssignment(assignment).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="getAssignmentSort"></a>
## `getAssignmentSort(reverse)`
Sorts an array of assignments by member.

### Params
* `reverse`: [bool, null] - reverses the sort order.

### Examples
```javascript
// ~~~~~
// Sorts assignments by member alphabetically
assignmentArray.sort(teamsnap.getAssignmentSort());
```


---


<a id="sendAssignmentEmails"></a>
## `sendAssignmentEmails(teamId, eventIds, message, sendingMemberId, callback)`
Sends assignments emails for events to members on a team.

### Params
* `teamId`: [int] - teamId of current team.
* `eventIds`: [array, object] - list of eventIds for selected events. Can also
   be an event object.
* `message`: [string] - message for email. (optional)
* `sendingMemberId`: [int] - memberId of member sending the email.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
//Sends assignments emails for events to members on a team.
teamsnap.sendAssignmentEmails(1, [2, 3], 10, "message");
```


---


<a id="reorderAssignments"></a>
## `reorderAssignments(eventId, assignmentIds, callback)`
Command to reorder `assignments` items based on an array of `assignmentIds`.

### Params
* `eventId`: [int] - an `eventId`.
* `assignmentIds`: [array] - an array of sorted `assignmentId`s.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Reorders assignment items.
teamsnap.reorderAssignments(123, [4,5,8,7,6]);
```


---


<a id="createBulkAssignments"></a>
## `createBulkAssignments(eventSet, description, teamId, createAsMemberId, callback)`
Command to create repeating `assignments` items based on `eventSet`.

### Params
* `eventSet`: [string] - `future_events`, `future_games` or `future_games_and_events`.
* `description`: [string] - `description` for repeating assignments.
* `teamId`: [int] - `teamId` of current team.
* `createAsMemberId`: [int] - `memberId` of member who created the repeating assignments.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Creates repeating assignments.
teamsnap.createBulkAssignments("future_games", "test description" , 1, 2);
```
