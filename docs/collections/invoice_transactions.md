# InvoiceTransactions

## Methods

- [loadInvoiceTransactions](#loadInvoiceTransactions)


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
