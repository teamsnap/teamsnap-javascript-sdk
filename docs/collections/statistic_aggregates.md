# Statistic Aggregates

## Methods

- [loadStatisticAggregates](#loadStatisticAggregates)

---
<a id="loadStatisticAggregates"></a>
## `loadStatisticAggregates(params, callback)`
Loads items from the `statisticAggregates` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.statisticAggregates.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all statisticAggregates for `teamId: 1`.
teamsnap.loadStatisticAggregates(1);

// ~~~~~
// Loads statisticAggregate for `statisticId: 1`.
teamsnap.loadStatisticAggregates({statisticId: 1});
```
