# Users

## Methods

- [loadUsers](#loadUsers)
- [saveUser](#saveUser)
- [sendEmailValidation](#sendEmailValidation)
- [dspPayload](#dspPayload)


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
## `sendEmailValidation(params, callback)`
Sends an email validation link to the User's email. A `teamId` or params object with a `teamId`
is required to redirect the user back to the current team when following the validation
link provided in the email.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Sends email validation email to current user (and redirects to `teamId: 1`).
teamsnap.sendEmailValidation({teamId: 1});
```


---


<a id="dspPayload"></a>
## `dspPayload(params, callback)`
This is a query endpoint off of user. memberId is the only required param, 
zone & kuid are optional, but should always be passed in so they will be passed back in the payload.
The endpoint will only return fields that have data. All null values are omitted from the response.
All values are returned as strings (booleans values are “0” or “1")

### Params
* `params`: [int, object] - can be either a `memberId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// returns item with property `customTargetingData`, value is stringified json
teamsnap.dspPayload(1);
teamsnap.dspPayload({memberId: 1});
teamsnap.dspPayload({memberId: 1, kuid: 123, zone: 1});
```
