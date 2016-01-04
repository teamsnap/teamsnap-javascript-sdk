# Forum Posts

## Methods

- [loadForumPosts](#loadForumPosts)
- [createForumPost](#createForumPost)
- [saveForumPost](#saveForumPost)
- [deleteForumPost](#deleteForumPost)


---
<a id="loadForumPosts"></a>
## `loadForumPosts(params, callback)`
Loads items from the `forumPosts` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.forumPosts.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all forumPosts for `teamId: 1`.
teamsnap.loadForumPosts(1);

// ~~~~~
// Loads all forumPosts for `forumTopicId: 1`.
teamsnap.loadForumPosts({forumTopicId: 1});
```


---


<a id="createForumPost"></a>
## `createForumPost(data)`
Creates a new `forumPost` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new forumPost item.
var forumPost = teamsnap.createForumPost();

// ~~~~~
// Creates a new forumPost item with `forumTopicId: 1` and `memberId: 1`.
var forumPost = teamsnap.createForumPost({forumTopicId: 1, memberId: 1});
```


---


<a id="saveForumPost"></a>
## `saveForumPost(forumPost, callback)`
Saves a `forumPost` item.

### Params
* `forumPost`: [object] - forumPost item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves forumPost item.
teamsnap.saveForumPost(forumPost);

// ~~~~~
// Creates a new forumPost then saves it.
var forumPost = teamsnap.createForumPost({
  forumTopicId: 1,
  memberId: '1',
  message: 'Example forum post!'
});

teamsnap.saveForumPost(forumPost);
```


---


<a id="deleteForumPost"></a>
## `deleteForumPost(forumPost, callback)`
Deletes a `forumPost` item.

### Params
* `forumPost`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a forumPost item.
teamsnap.deleteForumPost(forumPost);

// ~~~~~
// Creates a new forumPost, saves, then deletes it.
var forumPost = teamsnap.createForumPost({
  forumTopicId: 1,
  memberId: '1',
  message: 'Example forum post!'
});

teamsnap.saveForumPost(forumPost).then(function(){
  // Save complete, now delete.
  teamsnap.deleteForumPost(forumPost).then(function(){
    // Poof! It's gone!
  });
});
```
