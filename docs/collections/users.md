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


---


<a id="sendEmailValidation"></a>
## `sendEmailValidation(userId, callback)`
Sends an email validation link to the User's email. Will not send a new email if
the user has already validated their email address.

### Params
* `userId`: [int, object] - `userId` or `user` item for whom the validation email is to be sent.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Sends email validation email to user with `userId: 1`.
teamsnap.sendEmailValidation(1);
```
