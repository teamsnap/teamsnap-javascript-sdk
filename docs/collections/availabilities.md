# Availabilities

## Methods

- [loadAvailabilities](#loadAvailabilities)
- [saveAvailability](#saveAvailability)
- [bulkMarkUnsetAvailabilities](#bulkMarkUnsetAvailabilities)


---
<a id="loadAvailabilities"></a>
## `loadAvailabilities(params, callback)`
Loads items from the `availabilities` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.availabilities.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all availabilities for `teamId: 1`.
teamsnap.loadAvailabilities(1);

// ~~~~~
// Loads all availabilities for `memberId: 1`.
teamsnap.loadAvailabilities({memberId: 1});
```


---


<a id="saveAvailability"></a>
## `saveAvailability(availability, callback)`
Saves an `availability` item.

### Params
* `availability`: [object] - broadcastAlert item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves broadcastAlert item.
teamsnap.saveAvailability(availability);
```


---


<a id="bulkMarkUnsetAvailabilities"></a>
## `bulkMarkUnsetAvailabilities(memberId, statusCode, callback)`
Sets all previously unset availability statuses to `statusCode`.
Status codes can be found in `teamsnap.AVAILABILITIES`

### Params
* `memberId`: [int] - id of a member you can manage.
* `statusCode`: [int] - status code from `teamsnap.AVAILABILITIES`
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Bulk marks unset availabilities to `YES` for `memberId: 1`.
teamsnap.bulkMarkUnsetAvailabilities(1,1);
```
