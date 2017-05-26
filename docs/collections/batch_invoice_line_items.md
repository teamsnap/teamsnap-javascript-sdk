# BatchInvoiceLineItems

## Methods

- [loadBatchInvoiceLineItems](#loadBatchInvoiceLineItems)
- [createBatchInvoiceLineItem](#createBatchInvoiceLineItem)
- [saveBatchInvoiceLineItem](#saveBatchInvoiceLineItem)
- [deleteBatchInvoiceLineItem](#deleteBatchInvoiceLineItem)


---
<a id="loadBatchInvoiceLineItems"></a>
## `loadBatchInvoiceLineItems(params, callback)`
Loads items from the `batchInvoiceLineItems` collection based on given params.

### Params
* `params`: [object] - an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.batchInvoiceLineItems.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all batchInvoiceLineItems for `batchInvoiceId 1`.
teamsnap.loadBatchInvoiceLineItems({batchInvoiceId: 1});
```


---


<a id="createBatchInvoiceLineItem"></a>
## `createBatchInvoiceLineItem(data)`
Creates a new `batchInvoiceLineItem` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new batchInvoiceLineItem item.
var batchInvoiceLineItem = teamsnap.createBatchInvoiceLineItem();

// ~~~~~
// Creates a new batchInvoiceLineItem item with `batchInvoiceId: 1` and `quantity: 1, amount: 1.00`.
var batchInvoiceLineItem = teamsnap.createBatchInvoiceLineItem({batchInvoiceId: 1, quantity: 1, amount: 1.00});
```


---


<a id="saveBatchInvoiceLineItem"></a>
## `saveBatchInvoiceLineItem(batchInvoiceLineItem, callback)`
Saves a `batchInvoiceLineItem` item.

### Params
* `batchInvoiceLineItem`: [object] - batchInvoiceLineItem item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves batchInvoiceLineItem item.
teamsnap.saveBatchInvoiceLineItem(batchInvoiceLineItem);

// ~~~~~
// Creates a new batchInvoiceLineItem then saves it.
var batchInvoiceLineItem = teamsnap.createBatchInvoiceLineItem({
  batchInvoiceId: 1,
  quantity: 1,
  amount: 1.00
});

teamsnap.saveBatchInvoiceLineItem(batchInvoiceLineItem);
```


---


<a id="deleteBatchInvoiceLineItem"></a>
## `deleteBatchInvoiceLineItem(batchInvoiceLineItem, callback)`
Deletes a `batchInvoiceLineItem` item.

### Params
* `batchInvoiceLineItem`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a batchInvoiceLineItem item.
teamsnap.deleteBatchInvoiceLineItem(batchInvoiceLineItem);

// ~~~~~
// Creates a new batchInvoiceLineItem, saves, then deletes it.
var batchInvoiceLineItem = teamsnap.createBatchInvoiceLineItem({
  batchInvoiceId: 1,
  quantity: 1,
  amount: 1.00
});

teamsnap.saveBatchInvoiceLineItem(batchInvoiceLineItem).then(function(savedItem){
  // Save complete, now delete.
  teamsnap.deleteBatchInvoiceLineItem(savedItem).then(function(){
    // Poof! It's gone!
  });
});
```
