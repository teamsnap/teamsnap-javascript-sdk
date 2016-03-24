# Message Data

## Methods

- [loadMessageData](#loadMessageData)


---
<a id="loadMessageData"></a>
## `loadMessageData(params, callback)`
Loads items from the `messageData` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.messageData.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all messageData for `teamId: 1`.
teamsnap.loadMessageData(1);

// ~~~~~
// Loads all messageData for `userId: 1`.
teamsnap.loadMessageData({userId: 1});
```
