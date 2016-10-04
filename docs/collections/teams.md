# Teams

## Methods

- [loadTeams](#loadTeams)
- [loadTeam](#loadTeam)
- [createTeam](#createTeam)
- [saveTeam](#saveTeam)
- [deleteTeam](#deleteTeam)
- [bulkLoad](#bulkLoad)
- [invite](#invite)
- [updateTimeZone](#updateTimeZone)
- [resetStatistics](#resetStatistics)
- [divisionLoadTeams](#divisionLoadTeams)


---
<a id="loadTeams"></a>
## `loadTeams(params, callback)`
Loads items from the `teams` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teams.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teams for `teamId: 1`.
teamsnap.loadTeams(1);

// ~~~~~
// Loads a team for `id: 1`.
teamsnap.loadTeams({id: 1});
```


---


<a id="loadTeam"></a>
## `loadTeam(params, callback)`
Loads a Singular`team` item based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teams.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads a team for `id: 1`.
teamsnap.loadTeam({id: 1});
```


---


<a id="createTeam"></a>
## `createTeam(data)`
Creates a new `team` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new team item.
var team = teamsnap.createTeam();

// ~~~~~
// Creates a new team item with `teamId: 1`.
var team = teamsnap.createTeam({teamId: 1});
```


---


<a id="saveTeam"></a>
## `saveTeam(team, callback)`
Saves a `team` item.

### Params
* `team`: [object] - team item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves team item.
teamsnap.saveTeam(team);

// ~~~~~
// Creates a new team then saves it.
var team = teamsnap.createTeam({
  teamId: 1,
  name: 'Example team'
});

teamsnap.saveTeam(team);
```


---


<a id="deleteTeam"></a>
## `deleteTeam(team, callback)`
Deletes a `team` item.

### Params
* `team`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a team item.
teamsnap.deleteTeam(team);

// ~~~~~
// Creates a new team, saves, then deletes it.
var team = teamsnap.createTeam({
  teamId: 1,
  name: 'Example team'
});

teamsnap.saveTeam(team).then(function(){
  // Save complete, now delete.
  teamsnap.deleteTeam(team).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="bulkLoad"></a>
## `bulkLoad(teamId, types, callback)` / `bulkLoad(params, callback)`
Query that returns multiple types based on provided parameters.

In addition to bulk loading specific types for a given team, you can scope and filter the query to
return more specific datasets. We sometimes refer to this as "Smart Load", but it's still APIv3's
`bulk_load` query.

_Note: Some items, such as `availability` are not currently available for `bulkLoad` for performance reasons. Likewise, loading many types at once without narrowing the scope may provide a less than optimal response, or possibly incur an API timeout with larger datasets._

### Params
_Note: There are two ways you can call `bulkLoad`. This is the simple / classic way._
* `teamId`: [int] - a `teamId` to load items for.
* `types`: [array] - array of types to load.
* `callback`: [function] - callback to be executed when the operation completes.

_Using "Smart Load" params_
* `params`: [object] - object should contain the following params:
  - `teamId`: [int] - a `teamId` to load items for.
  - `types`: [array] - array of types to load.
  - `scopeTo`: [string] - item in the query to scope other items to.
  - `[itemType__queryParam]`: [string] - additional filters can be set with the item's type and one of its available search params separated by a double underscore (`__`). This accepts a string for the value - which could be a date, an ID, or event a list of IDs. See the specific event's available search params with `teamsnap.collections.[itemCollection].queries.search.params` where `itemCollection` is the collection to look up.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Bulk loads several types at once.
teamsnap.bulkLoad(1, ['member', 'event', 'assignment']);

// ~~~~~
// Bulk load events and assignments related to eventId 1-6.
bulkLoadParams = {
  teamId: 1,
  types: ['event', 'assignment'],
  scopeTo: 'event',
  event__id: '1,2,3,4,5,6'
}
teamsnap.bulkLoad(bulkLoadParams);
```


---


<a id="invite"></a>
## `invite(options)`
Command to invite a member to join a team.

### Params
* `options`: [object] - object should contain the following params:
  - `memberId`: [int] - `memberId` of member to invite if not a `contact` item.
  - `contactId`: [int] - `contactId` of contact to invite if not a `member` item.
  - `teamId`: [int] - `teamId` of the team you're inviting the member or contact to.

### Examples
```javascript
// ~~~~~
// Invites member `id: 1` to the team `id: 1`.
teamsnap.invite({memberId: 1, teamId: 1});
```


---


<a id="updateTimeZone"></a>
## `updateTimeZone(options)`
Command to update a team's timezone.

### Params
* `options`: [object] - object should contain the following params:
  - `timeZone`: [string] - IANA timezone.
  - `teamId`: [int] - `teamId` of contact to invite if not a `member` item.
  - `offsetTeamTimes`: [bool] - adjust team times to compensate for timezone change.

### Examples
```javascript
// ~~~~~
// Update timezone to "Denver" / MST.
teamsnap.updateTimeZone({timeZone: 'America/Denver', teamId: 1, offsetTeamTimes: true});
```


---


<a id="resetStatistics"></a>
## `resetStatistics(options)`
Resets a team's statistic data (statistics and statistic groups remain).

### Params
* `teamId`: [int] - `teamId` of the team whose statistics are to be reset.

### Examples
```javascript
// ~~~~~
// Update timezone to "Denver" / MST.
teamsnap.resetStatistics(1);
```


---


<a id="divisionLoadTeams"></a>
## `divisionLoadTeams(params)`
Search for teams in a division.

### Params
* `params`: [object] - params to search, must include `divisionId`

### Examples
```javascript
// ~~~~~
// Return all the active teams in a division
teamsnap.divisionLoadTeams({divisionId: 1, isActive: true});
```


---

