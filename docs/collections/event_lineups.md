# EventLineups

## Methods

- [loadEventLineups](#loadEventLineups)
- [createEventLineups](#createEventLineups)
- [saveEventLineups](#saveEventLineups)
- [deleteEventLineups](#deleteEventLineups)


---
<a id="loadEventLineups"></a>
## `loadEventLineups(params, callback)`
Loads items from the `eventLineups` collection based on given params.

### Params
* `params`: [int, object] - can be either a `eventId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.eventLineups.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all event lineups for `eventId: 1`.
teamsnap.loadEventLineups(1);

// ~~~~~
// Loads all event lineups for `id: 1`.
teamsnap.loadEventLineups({id: 1});

```

---
<a id="createEventLineup"></a>
## `createEventLineup(data)`
Creates a new `eventLineup` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new eventLineup item.
var eventLineup = teamsnap.createEventLineup();

// ~~~~~
// Creates a new eventLineup item with `eventId: 1`.
var eventLineup = teamsnap.createEventLineup({eventId: 1});
```

---


<a id="saveEventLineup"></a>
## `saveEventLineup(eventLineup, callback)`
Saves a `eventLineup` item.

### Params
* `eventLineup`: [object] - eventLineup item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves eventLineup item.
teamsnap.saveEventLineup(eventLineup);

// ~~~~~
// Creates a new eventLineup then saves it.
var eventLineup = teamsnap.createEventLineup({
  eventId: 1
});

teamsnap.saveEventLineup(eventLineup);
```


---


<a id="deleteEventLineup"></a>
## `deleteEventLineup(eventLineup, callback)`
Deletes a `eventLineup` item.

### Params
* `eventLineup`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a eventLineup item.
teamsnap.deleteEventLineup(eventLineup);

// ~~~~~
// Creates a new eventLineup, saves, then deletes it.
var eventLineup = teamsnap.createEventLineup({
  eventId: 1
});

teamsnap.saveEventLineup(eventLineup).then(function(){
  // Save complete, now delete.
  teamsnap.deleteEventLineup(eventLineup).then(function(){
    // Poof! It's gone!
  });
});
```


---
