# Members Preferences

## Methods

- [loadMembersPreferences](#loadMembersPreferences)
- [loadMemberPreferences](#loadMemberPreferences)
- [saveMemberPreferences](#saveMemberPreferences)


---
<a id="loadMembersPreferences"></a>
## `loadMembersPreferences(params, callback)`
Loads items from the `membersPreferences` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.membersPreferences.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all membersPreferences for `teamId: 1`.
teamsnap.loadMembersPreferences(1);

// ~~~~~
// Loads memberPreferences for `memberId: 1`.
teamsnap.loadMembersPreferences({memberId: 1});
```


---

<a id="loadMemberPreferences"></a>
## `loadMemberPreferences(params, callback)`
Loads a singular `memberPreferences` item based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.
`

### Examples
```javascript
// ~~~~~
// Loads memberPreferences for `memberId: 1`.
teamsnap.loadMemberPreferences({memberId: 1});
```


---


<a id="savememberPreferences"></a>
## `savememberPreferences(memberPreferences, callback)`
Saves a `memberPreferences` item.

### Params
* `memberPreferences`: [object] - memberPreferences item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves memberPreferences item.
teamsnap.savememberPreferences(memberPreferences);
```
