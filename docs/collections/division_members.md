# Load Division Members

## Methods

- [loadDivisionMembers](#loadDivisionMembers)


---
<a id="loadDivisionMembers"></a>
## `loadDivisionMembers(params, callback)`
Loads items from the `divisionMembers` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisionMembers.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all divisionMembers for `teamId: 1`.
teamsnap.loadDivisionMembers(1);
```
