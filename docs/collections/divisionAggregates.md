# Division Aggregates

## Methods

- [loadDivisionAggregates](#loadDivisionAggregates)


---
<a id="loadDivisionAggregates"></a>
## `loadDivisionAggregates(params, callback)`
Loads items from the `divisionAggregates` collection based on given params.

### Params
* `params`: [int, object] - can be either a `divisionId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisionAggregates.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all divisionAggregates for `divisionId: 1`.
teamsnap.loadDivisionAggregates(1);

// ~~~~~
// Loads all divisionAggregates for `divisionId: 1`.
teamsnap.loadDivisionAggregates({divisionId: 1});
```
