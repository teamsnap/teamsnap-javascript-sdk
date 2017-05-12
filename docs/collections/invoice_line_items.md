# InvoiceLineItems

## Methods

- [loadInvoiceLineItems](#loadInvoiceLineItems)
- [createInvoiceLineItem](#createInvoiceLineItem)
- [saveInvoiceLineItem](#saveInvoiceLineItem)
- [deleteInvoiceLineItem](#deleteInvoiceLineItem)


---
<a id="loadInvoiceLineItems"></a>
## `loadInvoiceLineItems(params, callback)`
Loads items from the `invoiceLineItems` collection based on given params.

### Params
* `params`: [object] - an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.invoiceLineItems.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all invoiceLineItems for `batchInvoiceId 1`.
teamsnap.loadInvoiceLineItems({batchInvoiceId: 1});
```


---


<a id="createInvoiceLineItem"></a>
## `createInvoiceLineItem(data)`
Creates a new `invoiceLineItem` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new invoiceLineItem item.
var invoiceLineItem = teamsnap.createInvoiceLineItem();

// ~~~~~
// Creates a new invoiceLineItem item with `batchInvoiceId: 1` and `quantity: '1', amount: 1.00`.
var invoiceLineItem = teamsnap.createInvoiceLineItem({batchInvoiceId: 1, quantity: '1', amount: 1.00});
```


---


<a id="saveInvoiceLineItem"></a>
## `saveInvoiceLineItem(invoiceLineItem, callback)`
Saves a `invoiceLineItem` item.

### Params
* `invoiceLineItem`: [object] - invoiceLineItem item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves invoiceLineItem item.
teamsnap.saveInvoiceLineItem(invoiceLineItem);

// ~~~~~
// Creates a new invoiceLineItem then saves it.
var invoiceLineItem = teamsnap.createInvoiceLineItem({
  batchInvoiceId: 1,
  quantity: '1',
  amount: 1.00
});

teamsnap.saveInvoiceLineItem(invoiceLineItem);
```


---


<a id="deleteInvoiceLineItem"></a>
## `deleteInvoiceLineItem(invoiceLineItem, callback)`
Deletes a `invoiceLineItem` item.

### Params
* `invoiceLineItem`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a invoiceLineItem item.
teamsnap.deleteInvoiceLineItem(invoiceLineItem);

// ~~~~~
// Creates a new invoiceLineItem, saves, then deletes it.
var invoiceLineItem = teamsnap.createInvoiceLineItem({
  batchInvoiceId: 1,
  quantity: '1',
  amount: 1.00
});

teamsnap.saveInvoiceLineItem(invoiceLineItem).then(function(savedItem){
  // Save complete, now delete.
  teamsnap.deleteInvoiceLineItem(savedItem).then(function(){
    // Poof! It's gone!
  });
});
```
