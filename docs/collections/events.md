# Events

## Methods

- [loadEvents](#loadEvents)
- [createEvent](#createEvent)
- [saveEvent](#saveEvent)
- [deleteEvent](#deleteEvent)
- [sendAvailabilityReminders](#sendAvailabilityReminders)
- [getEventSort](#getEventSort)
- [bulkCreateEvents](#bulkCreateEvents)


---
<a id="loadEvents"></a>
## `loadEvents(params, callback)`
Loads items from the `events` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.events.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all events for `teamId: 1`.
teamsnap.loadEvents(1);

// ~~~~~
// Loads all events for `contactId: 1`.
teamsnap.loadEvents({contactId: 1});
```


---


<a id="createEvent"></a>
## `createEvent(data)`
Creates a new `event` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new event item.
var event = teamsnap.createEvent();

// ~~~~~
// Creates a new event item with `isGame: true`.
var event = teamsnap.createEvent({isGame: true});
```


---


<a id="saveEvent"></a>
## `saveEvent(event, callback)`
Saves an `event` item.

### Params
* `event`: [object] - event item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves event item.
teamsnap.saveEvent(event);

// ~~~~~
// Creates a new event then saves it.
var event = teamsnap.createEvent({
  teamId: 1,
  locationId: 1,
  opponentId: 1
  isGame: true,
  startDate: new Date()
});

teamsnap.saveEvent(event);
```


---


<a id="deleteEvent"></a>
## `deleteEvent(event, include, notify, notifyAs, callback)`
Deletes an `event` item or items based on given params.

### Params
* `event`: [object] - an item to be deleted.
* `include`: [string, null] - additional events to delete related to `event`. Possible values are in `teamsnap.EVENTS`
* `notify`: [bool, null] - notify team of event(s) deletion.
* `notifyAs`: [int, null] - memberId of member notifying team. Required if `notify` is `true`
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a event item.
teamsnap.deleteEvent(event);

// ~~~~~
// Creates a new event, saves, then deletes it.
var event = teamsnap.createEvent({
  teamId: 1,
  locationId: 1,
  opponentId: 1
  isGame: true,
  startDate: new Date()
});

teamsnap.saveEvent(event).then(function(){
  // Save complete, now delete.
  teamsnap.deleteEvent(event).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="sendAvailabilityReminders"></a>
## `sendAvailabilityReminders(eventId, sendingMemberId, include)`
Sends availability reminders to given members of a team.

### Params
* `eventId`: [int, object] - eventId or event item to send availability reminders for.
* `sendingMemberId`: [int, object] - memberId or member item of member sending reminders.
* `include`: [array] - memberId array to whom the reminders will be sent.

### Examples
```javascript
// ~~~~~
// Sends an availability reminder.
teamsnap.sendAvailabilityReminders(1, 1, [2,3,4]);
```


---


<a id="getEventSort"></a>
## `getEventSort()`
Sorts an array of events.

### Params
_none_

### Examples
```javascript
// ~~~~~
// Sorts events by date.
eventArray.sort(teamsnap.getEventSort());

```


---
<a id="bulkCreateEvents"></a>
## `bulkCreateEvents(params, callback)`
Creates multiple events.

### Params
* `params`: [object] - Object that contains additional data:
  * `teamId`: [int] - Id of Team the events are for
  * `events`: [array] - Array of event objects to create
  * `sendingMemberId`: [int] - Id of member that notify email will come from (optional).
  * `notifyTeam` - [bool] - Flag indictating if notify email should be sent to team.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Creates multiple events for `teamId: 1` and sends a notify email to team.
teamsnap.bulkCreateEvents({
  teamId: 1,
  events: [{
    teamId: 1,
    locationId: 1,
    opponentId: 1
    isGame: true,
    startDate: new Date()
  },
  sendingMemberId: 1,
  notifyTeam: true
});
```


---