# Divisions Preferences

## Methods

- [loadDivisionsPreferences](#loadDivisionsPreferences)
- [loadDivisionPreferences](#loadDivisionPreferences)
- [saveDivisionPreferences](#saveDivisionPreferences)


---
<a id="loadDivisionsPreferences"></a>
## `loadDivisionsPreferences(params, callback)`
Loads items from the `divisionsPreferences` collection based on given params.

### Params
* `params`: [int, object] - can be either a `divisionId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.divisionsPreferences.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all divisionsPreferences for `divisionId: 1`.
teamsnap.loadDivisionsPreferences(1);

// ~~~~~
// Loads divisionPreferences for `divisionId: 1`.
teamsnap.loadDivisionsPreferences({divisionId: 1});
```


---

<a id="loadDivisionPreferences"></a>
## `loadDivisionPreferences(params, callback)`
Loads a singular `divisionPreferences` item based on given params.

### Params
* `params`: [int, object] - can be either a `divisionId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.
`

### Examples
```javascript
// ~~~~~
// Loads divisionPreferences for `divisionId: 1`.
teamsnap.loadDivisionPreferences({divisionId: 1});
```


---


<a id="saveDivisionPreferences"></a>
## `saveDivisionPreferences(divisionPreferences, callback)`
Saves a `divisionPreferences` item.

### Params
* `divisionPreferences`: [object] - divisionPreferences item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves divisionPreferences item.
teamsnap.saveDivisionPreferences(divisionPreferences);
```
