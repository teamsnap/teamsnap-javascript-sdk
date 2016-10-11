# Messages

## Methods

- [loadMessages](#loadMessages)
- [markMessageAsRead](#markMessageAsRead)
- [bulkDeleteMessages](#bulkDeleteMessages)


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

---


<a id="bulkDeleteMessages"></a>
## `bulkDeleteMessages(params)`
Deletes a single 'message' item or an array of `message` items.

_Note: While apiv3 expects an array of ids, you must pass an array of message objects to take advantage of the persistence layer's unlinking feature. If you don't need this automatic unlinking of items, it is perfectly acceptable to just use an array of ids._

### Params
* `params`: [int, array, object] - An array of message items or ids or a single message item or id
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes an array of messages.
var messages = [message1, message2, message3]
teamsnap.bulkDeleteMessages(messages);

// Deletes a single message.
teamsnap.bulkDeleteMessages(message1);

// Deletes multiple messages by id
var messages = [1, 2, 3]
teamsnap.bulkDeleteMessages(messages);

// Deletes a single message by id.
teamsnap.bulkDeleteMessages(1);
```
