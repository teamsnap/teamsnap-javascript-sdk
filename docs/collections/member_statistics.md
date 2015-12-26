# Member Statistics

## Methods

- [loadMemberStatistics](#loadMemberStatistics)


---
<a id="loadMemberStatistics"></a>
## `loadMemberStatistics(params, callback)`
Loads items from the `memberStatistics` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.memberStatistics.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all memberStatistics for `teamId: 1`.
teamsnap.loadMemberStatistics(1);

// ~~~~~
// Loads all memberStatistics for `memberId: 1`.
teamsnap.loadMemberStatistics({memberId: 1});
```
