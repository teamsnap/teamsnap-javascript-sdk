# Team Medium Comments

## Methods

- [loadTeamMediumComments](#loadTeamMediumComments)
- [createTeamMediumComment](#createTeamMediumComment)
- [saveTeamMediumComment](#saveTeamMediumComment)
- [deleteTeamMediumComment](#deleteTeamMediumComment)


---
<a id="loadTeamMediumComments"></a>
## `loadTeamMediumComments(params, callback)`
Loads items from the `teamMediumComments` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamMediumComments.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teamMediumComments for `teamId: 1`.
teamsnap.loadTeamMediumComments(1);

// ~~~~~
// Loads a teamMediumComment for `id: 1`.
teamsnap.loadTeamMediumComments({id: 1});
```


---


<a id="createTeamMediumComment"></a>
## `createTeamMediumComment(data)`
Creates a new `teamMediumComment` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new teamMediumComment item.
var teamMediumComment = teamsnap.createTeamMediumComment();

// ~~~~~
// Creates a new teamMediumComment item with `teamId: 1`.
var teamMediumComment = teamsnap.createTeamMediumComment({teamId: 1});
```


---


<a id="saveTeamMediumComment"></a>
## `saveTeamMediumComment(teamMediumComment, callback)`
Saves a `teamMediumComment` item.

### Params
* `teamMediumComment`: [object] - teamMediumComment item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves teamMediumComment item.
teamsnap.saveTeamMediumComment(teamMediumComment);

// ~~~~~
// Creates a new teamMediumComment then saves it.
var teamMediumComment = teamsnap.createTeamMediumComment({
  teamId: 1,
  memberId: 1,
  teamMediumId: 1,
  comment: 'Example Team Medium Comment.'
});

teamsnap.saveTeamMediumComment(teamMediumComment);
```


---


<a id="deleteTeamMediumComment"></a>
## `deleteTeamMediumComment(teamMediumComment, callback)`
Deletes a `teamMediumComment` item.

### Params
* `teamMediumComment`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a teamMediumComment item.
teamsnap.deleteTeamMediumComment(teamMediumComment);

// ~~~~~
// Creates a new teamMediumComment, saves, then deletes it.
var teamMediumComment = teamsnap.createTeamMediumComment({
  teamId: 1,
  memberId: 1,
  teamMediumId: 1,
  comment: 'Example Team Medium Comment.'
});

teamsnap.saveTeamMediumComment(teamMediumComment).then(function(){
  // Save complete, now delete.
  teamsnap.deleteTeamMediumComment(teamMediumComment).then(function(){
    // Poof! It's gone!
  });
});
```
