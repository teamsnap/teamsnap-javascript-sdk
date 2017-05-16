# BatchInvoices

## Methods

- [loadBatchInvoices](#loadBatchInvoices)
- [createBatchInvoice](#createBatchInvoice)
- [saveBatchInvoice](#saveBatchInvoice)
- [deleteBatchInvoice](#deleteBatchInvoice)


---
<a id="loadBatchInvoices"></a>
## `loadBatchInvoices(params, callback)`
Loads items from the `batchInvoices` collection based on given params.

### Params
* `params`: [object] - an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.batchInvoices.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all batchInvoices for `id: 1`.
teamsnap.loadBatchInvoices({id: 1});
```


---


<a id="createBatchInvoice"></a>
## `createBatchInvoice(data)`
Creates a new `batchInvoice` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new batchInvoice item.
var batchInvoice = teamsnap.createBatchInvoice();

// ~~~~~
// Creates a new batchInvoice item with `divisionId: 1` and `description: 'Tourney Fees'`.
var batchInvoice = teamsnap.createBatchInvoice({divisionId: 1, description: 'Tourney Fees'});
```


---


<a id="saveBatchInvoice"></a>
## `saveBatchInvoice(batchInvoice, callback)`
Saves a `batchInvoice` item.

### Params
* `batchInvoice`: [object] - batchInvoice item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves batchInvoice item.
teamsnap.saveBatchInvoice(batchInvoice);

// ~~~~~
// Creates a new batchInvoice then saves it.
var batchInvoice = teamsnap.createBatchInvoice({
  divisionId: 1,
  description: 'Tourney Fees'
});

teamsnap.saveBatchInvoice(batchInvoice);
```


---


<a id="deleteBatchInvoice"></a>
## `deleteBatchInvoice(batchInvoice, callback)`
Deletes a `batchInvoice` item.

### Params
* `batchInvoice`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a batchInvoice item.
teamsnap.deleteBatchInvoice(batchInvoice);

// ~~~~~
// Creates a new batchInvoice, saves, then deletes it.
var batchInvoice = teamsnap.createBatchInvoice({
  divisionId: 1,
  description: 'Tourney Fees'
});

teamsnap.saveBatchInvoice(batchInvoice).then(function(savedItem){
  // Save complete, now delete.
  teamsnap.deleteBatchInvoice(savedItem).then(function(){
    // Poof! It's gone!
  });
});
```
