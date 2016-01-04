# Event Statistics

## Methods

- [loadEventStatistics](#loadEventStatistics)


---
<a id="loadEventStatistics"></a>
## `loadEventStatistics(params, callback)`
Loads items from the `eventStatistics` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.eventStatistics.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all eventStatistics for `teamId: 1`.
teamsnap.loadEventStatistics(1);

// ~~~~~
// Loads all eventStatistics for `statisticId: 1`.
teamsnap.loadEventStatistics({statisticId: 1});
```
