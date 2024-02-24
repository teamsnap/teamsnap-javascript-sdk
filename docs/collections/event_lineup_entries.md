# EventLineupEntries

## Methods

- [createEventLineupEntries](#createEventLineupEntries)
- [saveEventLineupEntries](#saveEventLineupEntries)
- [deleteEventLineupEntries](#deleteEventLineupEntries)


---
<a id="loadEventLineupEntries"></a>
EventLineupEntries API endpoint has some irregularities. The search endpoint goes to eventLineup href 
(this endpoint is used for loading). This method is omitted intentionally to prevent headaches.

---
<a id="createEventLineupEntry"></a>
## `createEventLineupEntry(data)`
Creates a new `eventLineupEntry` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new eventLineupEntry item.
var eventLineupEntry = teamsnap.createEventLineupEntry();

// ~~~~~
// Creates a new eventLineupEntry item with `eventLineupId: 123`.
var eventLineupEntry = teamsnap.createEventLineupEntry(
  {
    eventLineupId: 123,
    memberId: 1,
    label: 'QB',
    sequence: '1'
    }
  );
```

---


<a id="saveEventLineupEntry"></a>
## `saveEventLineupEntry(eventLineupEntry, callback)`
Saves a `eventLineupEntry` item.

### Params
* `eventLineupEntry`: [object] - eventLineupEntry item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves eventLineupEntry item.
teamsnap.saveEventLineupEntry(eventLineupEntry);

// ~~~~~
// Creates a new eventLineupEntry then saves it.
var eventLineupEntry = teamsnap.createEventLineupEntry({
  {
    eventLineupId: 123,
    memberId: 1,
    label: 'QB',
    sequence: '1'
    }
});

teamsnap.saveEventLineupEntry(eventLineupEntry);
```


---


<a id="deleteEventLineupEntry"></a>
## `deleteEventLineupEntry(eventLineupEntry, callback)`
Deletes a `eventLineupEntry` item.

### Params
* `eventLineupEntry`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a eventLineupEntry item.
teamsnap.deleteEventLineupEntry(eventLineupEntry);

// ~~~~~
// Creates a new eventLineupEntry, saves, then deletes it.
var eventLineupEntry = teamsnap.createEventLineupEntry({
  eventId: 1
});

teamsnap.saveEventLineupEntry(eventLineupEntry).then(function(){
  // Save complete, now delete.
  teamsnap.deleteEventLineupEntry(eventLineupEntry).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="bulkUpdateEventLineupEntries"></a>
## `bulkUpdateEventLineupEntries(eventLineupEntry, callback)`
EventLineupEntries API endpoint has some irregularities. bulkUpdateEventLineupEntries expects url parameters, not data in the request body. This method is omitted intentionally.
