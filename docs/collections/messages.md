# Messages

## Methods

- [loadMessages](#loadMessages)
- [markMessageAsRead](#markMessageAsRead)


---
<a id="loadMessages"></a>
## `loadMessages(params, callback)`
Loads items from the `messages` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.messages.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all messages for `teamId: 1`.
teamsnap.loadMessages(1);

// ~~~~~
// Loads messages for `userId: 1`.
teamsnap.loadMessages({userId: 1});
```


---


<a id="markMessageAsRead"></a>
## `markMessageAsRead(params)`
Marks a `message` item as read.

### Params
* `params`: [int, object] - ID of the message, or the message object to mark as read.

### Examples
```javascript
// ~~~~~
// Marks a message as read.
var message = teamsnap.markMessageAsRead(1);

// ~~~~~
// Marks a message as read.
var message = teamsnap.markMessageAsRead(messageToMarkAsUnread);
```
