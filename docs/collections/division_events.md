# Division Events

## Methods

- [loadDivisionEvents](#loadDivisionEvents)


---
<a id="loadDivisionEvents"></a>
## `loadDivisionEvents(params, callback)`
Loads items from the `divisionEvents` collection based on given params.

### Params
* `params`: [int, object] - can be either a `divisionId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Loads all divisionEvents for `divisionId: 1`.
teamsnap.loadDivisionEvents(1);

// ~~~~~
// Loads all divisionEvents for `id: 1`.
teamsnap.loadDivisionEvents({id: 1});
```
