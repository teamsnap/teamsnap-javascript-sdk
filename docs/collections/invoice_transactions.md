# InvoiceTransactions

## Methods

- [loadInvoiceTransactions](#loadInvoiceTransactions)
- [createInvoiceTransaction](#createInvoiceTransaction)
- [saveInvoiceTransaction](#saveInvoiceTransaction)

---
<a id="loadInvoiceTransactions"></a>
## `loadInvoiceTransactions(params, callback)`
Loads items from the `invoiceTransactions` collection based on given params.

### Params
* `params`: [object] - an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.invoiceTransactions.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all invoiceTransactions for `invoiceId: 1`.
teamsnap.loadInvoiceTransactions({invoiceId: 1});
```


---


<a id="createInvoiceTransaction"></a>
## `createInvoiceTransaction(data)`
Creates a new `invoiceTransaction` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new invoiceTransaction item.
var invoiceTransaction = teamsnap.createInvoiceTransaction();

// ~~~~~
// Creates a new invoiceTransaction item with `invoiceId: 1`.
var invoiceTransaction = teamsnap.createInvoiceTransaction({
  invoiceId: 1,
  kind: 'check',
  amount: 1.00
});
```


---


<a id="saveInvoiceTransaction"></a>
## `saveInvoiceTransaction(invoiceTransaction, callback)`
Saves a `invoiceTransaction` item.

### Params
* `invoiceTransaction`: [object] - invoiceTransaction item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves invoiceTransaction item.
teamsnap.saveInvoiceTransaction(invoiceTransaction);

// ~~~~~
// Creates a new invoiceTransaction then saves it.
var invoiceTransaction = teamsnap.createInvoiceTransaction({
  invoiceId: 1,
  kind: 'check',
  amount: 1.00
});

teamsnap.saveInvoiceTransaction(invoiceTransaction);
```
