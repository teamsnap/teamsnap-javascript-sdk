# Invoices

## Methods

- [loadInvoices](#loadInvoices)
- [createInvoice](#createInvoice)
- [saveInvoice](#saveInvoice)
- [deleteInvoice](#deleteInvoice)


---
<a id="loadInvoices"></a>
## `loadInvoices(params, callback)`
Loads items from the `invoices` collection based on given params.

### Params
* `params`: [object] - an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.invoices.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads invoice with `id: 1`.
teamsnap.loadInvoices({id: 1});
```


---


<a id="createInvoice"></a>
## `createInvoice(data)`
Creates a new `invoice` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new invoice item.
var invoice = teamsnap.createInvoice();

// ~~~~~
// Creates a new invoice item with `batchInvoiceId: 1` and `memberId: 1`.
var invoice = teamsnap.createInvoice({batchInvoiceId: 1, memberId: 1});
```


---


<a id="saveInvoice"></a>
## `saveInvoice(invoice, callback)`
Saves an `invoice` item.

### Params
* `invoice`: [object] - invoice item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves invoice item.
teamsnap.saveInvoice(invoice);

// ~~~~~
// Creates a new invoice then saves it.
var invoice = teamsnap.createInvoice({
  batchInvoiceId: 1,
  memberId: 1
});

teamsnap.saveInvoice(invoice);
```


---


<a id="deleteInvoice"></a>
## `deleteInvoice(invoice, callback)`
Deletes a `invoice` item.

### Params
* `invoice`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes an invoice item.
teamsnap.deleteInvoice(invoice);

// ~~~~~
// Creates a new invoice, saves, then deletes it.
var invoice = teamsnap.createInvoice({
  batchInvoiceId: 1,
  memberId: 1
});

teamsnap.saveInvoice(invoice).then(function(savedItem){
  // Save complete, now delete.
  teamsnap.deleteInvoice(savedItem).then(function(){
    // Poof! It's gone!
  });
});
```
