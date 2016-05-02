# Division Message Data

## Methods

- [loadDivisionMessageData](#loadDivisionMessageData)


---
<a id="loadDivisionMessageData"></a>
## `loadDivisionMessageData(params, callback)`
Loads items from the `divisionMessageData` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisionMessageData.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all divisionMessageData for `teamId: 1`.
teamsnap.loadDivisionMessageData(1);

// ~~~~~
// Loads all divisionMessageData for `userId: 1`.
teamsnap.loadDivisionMessageData({userId: 1});
```
