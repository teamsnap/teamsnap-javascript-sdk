# Custom Fields

## Methods

- [loadCustomFields](#loadCustomFields)
- [createCustomField](#createCustomField)
- [saveCustomField](#saveCustomField)
- [deleteCustomField](#deleteCustomField)


---
<a id="loadCustomFields"></a>
## `loadCustomFields(params, callback)`
Loads items from the `customFields` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.customFields.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all customFields for `teamId: 1`.
teamsnap.loadCustomFields(1);

// ~~~~~
// Loads all customField for `id: 1`.
teamsnap.loadCustomFields({id: 1});
```


---


<a id="createCustomField"></a>
## `createCustomField(data)`
Creates a new `customField` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new customField item.
var customField = teamsnap.createCustomField();

// ~~~~~
// Creates a new customField item with `kind: 'text'`.
var customField = teamsnap.createCustomField({kind: 'text'});
```


---


<a id="saveCustomField"></a>
## `saveCustomField(customField, callback)`
Saves a `customField` item.

### Params
* `customField`: [object] - customField item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves customField item.
teamsnap.saveCustomField(customField);

// ~~~~~
// Creates a new customField then saves it.
var customField = teamsnap.createCustomField({
  teamId: 1,
  name: 'Example Custom Field',
  kind: 'text'
});

teamsnap.saveCustomField(customField);
```


---


<a id="deleteCustomField"></a>
## `deleteCustomField(customField, callback)`
Deletes a `customField` item.

### Params
* `customField`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a customField item.
teamsnap.deleteCustomField(customField);

// ~~~~~
// Creates a new customField, saves, then deletes it.
var customField = teamsnap.createCustomField({
  teamId: 1,
  name: 'Example Custom Field',
  kind: 'text'
});

teamsnap.saveCustomField(customField).then(function(){
  // Save complete, now delete.
  teamsnap.deleteCustomField(customField).then(function(){
    // Poof! It's gone!
  });
});
```
