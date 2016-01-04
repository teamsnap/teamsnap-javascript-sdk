# Forum Subscriptions

## Methods

- [loadForumSubscriptions](#loadForumSubscriptions)
- [createForumSubscription](#createForumSubscription)
- [saveForumSubscription](#saveForumSubscription)
- [deleteForumSubscription](#deleteForumSubscription)


---
<a id="loadForumSubscriptions"></a>
## `loadForumSubscriptions(params, callback)`
Loads items from the `forumSubscriptions` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.forumSubscriptions.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all forumSubscriptions for `teamId: 1`.
teamsnap.loadForumSubscriptions(1);

// ~~~~~
// Loads all forumSubscriptions for `forumTopicId: 1`.
teamsnap.loadForumSubscriptions({forumTopicId: 1});
```


---


<a id="createForumSubscription"></a>
## `createForumSubscription(data)`
Creates a new `forumSubscription` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new forumSubscription item.
var forumSubscription = teamsnap.createForumSubscription();

// ~~~~~
// Creates a new forumSubscription item with `forumTopicId: 1` and `memberId: 1`.
var forumSubscription = teamsnap.createForumSubscription({forumTopicId: 1, memberId: 1});
```


---


<a id="saveForumSubscription"></a>
## `saveForumSubscription(forumSubscription, callback)`
Saves a `forumSubscription` item.

### Params
* `forumSubscription`: [object] - forumSubscription item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves forumSubscription item.
teamsnap.saveForumSubscription(forumSubscription);

// ~~~~~
// Creates a new forumSubscription then saves it.
var forumSubscription = teamsnap.createForumSubscription({
  forumTopicId: 1,
  memberId: '1'
});

teamsnap.saveForumSubscription(forumSubscription);
```


---


<a id="deleteForumSubscription"></a>
## `deleteForumSubscription(forumSubscription, callback)`
Deletes a `forumSubscription` item.

### Params
* `forumSubscription`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a forumSubscription item.
teamsnap.deleteForumSubscription(forumSubscription);

// ~~~~~
// Creates a new forumSubscription, saves, then deletes it.
var forumSubscription = teamsnap.createForumSubscription({
  forumTopicId: 1,
  memberId: '1'
});

teamsnap.saveForumSubscription(forumSubscription).then(function(){
  // Save complete, now delete.
  teamsnap.deleteForumSubscription(forumSubscription).then(function(){
    // Poof! It's gone!
  });
});
```
