# Custom Data

## Methods

- [loadCustomData](#loadCustomData)
- [createCustomDatum](#createCustomDatum)
- [saveCustomDatum](#saveCustomDatum)


---
<a id="loadCustomData"></a>
## `loadCustomData(params, callback)`
Loads items from the `customData` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.customData.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all customData for `teamId: 1`.
teamsnap.loadCustomData(1);

// ~~~~~
// Loads all customData for `memberId: 1`.
teamsnap.loadCustomData({memberId: 1});
```


---


<a id="createCustomDatum"></a>
## `createCustomDatum(data)`
Creates a new `customDatum` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new customDatum item.
var customDatum = teamsnap.createCustomDatum();

// ~~~~~
// Creates a new customDatum item with `contactId: 1` and `phoneNumber: 1`.
var customDatum = teamsnap.createCustomDatum({customFieldId: 1, value: 'Test!'});
```


---


<a id="saveCustomDatum"></a>
## `saveCustomDatum(customDatum, callback)`
Saves a `customDatum` item.

### Params
* `customDatum`: [object] - customDatum item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves customDatum item.
teamsnap.saveCustomDatum(customDatum);

// ~~~~~
// Creates a new customDatum then saves it.
var customDatum = teamsnap.createCustomDatum({
  customFieldId: 1,
  value: 'test'
});

teamsnap.saveCustomDatum(customDatum)
```
