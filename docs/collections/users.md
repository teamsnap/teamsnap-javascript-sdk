# Users

## Methods

- [loadUsers](#loadUsers)
- [saveUser](#saveUser)


---
<a id="loadUsers"></a>
## `loadUsers(params, callback)`
Loads items from the `users` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.users.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all users for `teamId: 1`.
teamsnap.loadUsers(1);

// ~~~~~
// Loads a user for `id: 1`.
teamsnap.loadUsers({id: 1});
```


---
<a id="loadMe"></a>
## `loadMe(callback)`
Queries the `/me` endpoint loading the current user.

### Params
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Loads current user.
teamsnap.loadMe();
```


---


<a id="saveUser"></a>
## `saveUser(user, callback)`
Saves a `user` item.

### Params
* `user`: [object] - user item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves user item.
teamsnap.saveUser(user);
```
