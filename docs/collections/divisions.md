# Divisions

## Methods

- [loadDivisions](#loadDivisions)
- [loadDivision](#loadDivision)
- [createDivision](#createDivision)
- [deleteDivision](#deleteDivision)
- [loadAncestorDivisions](#loadAncestorDivisions)
- [loadDescendantDivisions](#loadDescendantDivisions)
- [loadChildDivisions](#loadChildDivisions)
- [loadActiveTrialDivisions](#loadActiveTrialDivisions)

---
<a id="loadDivisions"></a>
## `loadDivisions(params, callback)`
Loads items from the `divisions` collection based on given params.

### Params
* `params`: [int, object] - can be either a `divisionId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisions.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all divisions for `divisionId: 1`.
teamsnap.loadDivisions(1);

// ~~~~~
// Loads a division for `id: 1`.
teamsnap.loadDivisions({id: 1});
```


---



<a id="loadDivision"></a>
## `loadDivision(params, callback)`
Loads a Singular `division` item based on given params.

### Params
* `params`: [int] - this must be a `divisionId`
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisions.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads a division for `id: 1`.
teamsnap.loadDivision({id: 1});
```


---


<a id="createDivision"></a>
## `createDivision(data)`
Creates a new `division` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new division item.
var division = teamsnap.createDivision();

// ~~~~~
// Creates a new division item with `id: 1`.
var division = teamsnap.createDivision({id: 1});
```


---


<a id="saveDivision"></a>
## `saveDivision(division, callback)`
Saves a `division` item.

### Params
* `division`: [object] - division item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves division item.
teamsnap.saveDivision(division);

// ~~~~~
// Creates a new division then saves it.
var division = teamsnap.createDivision({
  id: 1,
  name: 'Example division'
});

teamsnap.saveDivision(division);
```


---


<a id="deleteDivision"></a>
## `deleteDivision(division, callback)`
Deletes a `division` item.

### Params
* `division`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a division item.
teamsnap.deleteDivision(division);

// ~~~~~
// Creates a new division, saves, then deletes it.
var division = teamsnap.createDivision({
  id: 1,
  name: 'Example division'
});

teamsnap.saveDivision(division).then(function(){
  // Save complete, now delete.
  teamsnap.deleteDivision(division).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="loadAncestorDivisions"></a>
## `loadAncestorDivisions(divisionId, callback)`
Returns the ancestor `division` items.

### Params
* `divisionId`: [int] - a divisionId.
* `callback`: [function] - callback to be executed when the operation completes.
### Examples
```javascript
// ~~~~~
// Returns the ancestor divisions.
var divisions = teamsnap.loadAncestorDivisions(1);
```


---


<a id="loadDescendantDivisions"></a>
## `loadDescendantDivisions(divisionId, callback)`
Returns the descendant `division` items.

### Params
* `divisionId`: [int] - a divisionId.
* `callback`: [function] - callback to be executed when the operation completes.
### Examples
```javascript
// ~~~~~
// Returns the descendant divisions.
var divisions = teamsnap.loadDescendantDivisions(1);
```


---


<a id="loadChildDivisions"></a>
## `loadChildDivisions(divisionId, callback)`
Returns the child `division` items.

### Params
* `divisionId`: [int] - a divisionId.
* `callback`: [function] - callback to be executed when the operation completes.
### Examples
```javascript
// ~~~~~
// Returns the child divisions.
var divisions = teamsnap.loadChildDivisions(1);
```


---


<a id="loadActiveTrialDivisions"></a>
## `loadActiveTrialDivisions(userId, callback)`
Returns the active trial divisions for a given user id.

### Params
* `userId`: [int] - a userId.
* `callback`: [function] - callback to be executed when the operation completes.
### Examples
```javascript
// ~~~~~
// Returns the active trial divisions for user.
var activeTrials = teamsnap.loadActiveTrialDivisions(1);
```


---
