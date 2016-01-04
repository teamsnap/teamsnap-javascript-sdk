# Division Members Preferenes

## Methods

- [loadDivisionMembersPreferences](#loadDivisionMembersPreferences)
- [loadDivisionMemberPreferences](#loadDivisionMemberPreferences)
- [saveDivisionMemberPreferences](#saveDivisionMemberPreferences)


---
<a id="loadDivisionMembersPreferences"></a>
## `loadDivisionMembersPreferences(params, callback)`
Loads items from the `divisionMembersPreferences` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisionMembersPreferences.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all divisionMembersPreferences for `teamId: 1`.
teamsnap.loadDivisionMembersPreferences(1);
```


---



<a id="loadDivisionMemberPreferences"></a>
## `loadDivisionMemberPreferences(params, callback)`
Loads a single item from the `divisionMembersPreferences` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisionMembersPreferences.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all divisionMembersPreferences for `id: 1`.
teamsnap.loadDivisionMembersPreferences({id: 1});
```



---



<a id="saveDivisionMemberPreferences"></a>
## `saveDivisionMemberPreferences(divisionMemberPreferences, callback)`
Saves a `divisionMemberPreferences` item.

### Params
* `divisionMemberPreferences`: [object] - divisionMemberPreferences item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves divisionMemberPreferences item.
teamsnap.saveDivisionMemberPreferences(divisionMemberPreferences);
```
