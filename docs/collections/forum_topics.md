# Forum Topics

## Methods

- [loadForumTopics](#loadForumTopics)
- [createForumTopic](#createForumTopic)
- [saveForumTopic](#saveForumTopic)
- [deleteForumTopic](#deleteForumTopic)


---
<a id="loadForumTopics"></a>
## `loadForumTopics(params, callback)`
Loads items from the `forumTopics` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.forumTopics.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all forumTopics for `teamId: 1`.
teamsnap.loadForumTopics(1);

// ~~~~~
// Loads forumTopic for `id: 1`.
teamsnap.loadForumTopics({id: 1});
```


---


<a id="createForumTopic"></a>
## `createForumTopic(data)`
Creates a new `forumTopic` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new forumTopic item.
var forumTopic = teamsnap.createForumTopic();

// ~~~~~
// Creates a new forumTopic item with `teamId: 1` and `title: 'Example!'`.
var forumTopic = teamsnap.createForumTopic({teamId: 1, title: 'Example!'});
```


---


<a id="saveForumTopic"></a>
## `saveForumTopic(forumTopic, callback)`
Saves a `forumTopic` item.

### Params
* `forumTopic`: [object] - forumTopic item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves forumTopic item.
teamsnap.saveForumTopic(forumTopic);

// ~~~~~
// Creates a new forumTopic then saves it.
var forumTopic = teamsnap.createForumTopic({
  teamId: 1,
  title: 'Example!'
});

teamsnap.saveForumTopic(forumTopic);
```


---


<a id="deleteForumTopic"></a>
## `deleteForumTopic(forumTopic, callback)`
Deletes a `forumTopic` item.

### Params
* `forumTopic`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a forumTopic item.
teamsnap.deleteForumTopic(forumTopic);

// ~~~~~
// Creates a new forumTopic, saves, then deletes it.
var forumTopic = teamsnap.createForumTopic({
  teamId: 1,
  title: 'Example!'
});

teamsnap.saveForumTopic(forumTopic).then(function(){
  // Save complete, now delete.
  teamsnap.deleteForumTopic(forumTopic).then(function(){
    // Poof! It's gone!
  });
});
```
