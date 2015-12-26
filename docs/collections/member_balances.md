# Member Balances

## Methods

- [loadMemberBalances](#loadMemberBalances)


---
<a id="loadMemberBalances"></a>
## `loadMemberBalances(params, callback)`
Loads items from the `memberBalances` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.memberBalances.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all memberBalances for `teamId: 1`.
teamsnap.loadMemberBalances(1);

// ~~~~~
// Loads all memberBalances for `memberId: 1`.
teamsnap.loadMemberBalances({memberId: 1});
```
