# Division Locations

## Methods

- [loadDivisionLocations](#loadDivisionLocations)


---
<a id="loadDivisionLocations"></a>
## `loadDivisionLocations(params, callback)`
Loads items from the `divisionLocations` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisionLocations.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all divisionLocations for `teamId: 1`.
teamsnap.loadDivisionLocations(1);

// ~~~~~
// Loads all customField for `id: 1`.
teamsnap.loadDivisionLocations({id: 1});
```
