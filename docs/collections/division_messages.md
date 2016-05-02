# Division Messages

## Methods

- [loadDivisionMessages](#loadDivisionMessages)


---
<a id="loadDivisionMessages"></a>
## `loadDivisionMessages(params, callback)`
Loads items from the `divisionMessages` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisionMessages.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all divisionMessages for `teamId: 1`.
teamsnap.loadDivisionMessages(1);

// ~~~~~
// Loads divisionMessages for `userId: 1`.
teamsnap.loadDivisionMessages({userId: 1});
```
