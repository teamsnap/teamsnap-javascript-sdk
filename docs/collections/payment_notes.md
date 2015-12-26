# Payment Notes

## Methods

- [loadPaymentNotes](#loadPaymentNotes)
- [createPaymentNote](#createPaymentNote)
- [savePaymentNote](#savePaymentNote)


---
<a id="loadPaymentNotes"></a>
## `loadPaymentNotes(params, callback)`
Loads items from the `paymentNotes` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.paymentNotes.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all paymentNotes for `teamId: 1`.
teamsnap.loadPaymentNotes(1);

// ~~~~~
// Loads all paymentNotes for `memberPaymentId: 1`.
teamsnap.loadPaymentNotes({memberPaymentId: 1});
```


---


<a id="createPaymentNote"></a>
## `createPaymentNote(data)`
Creates a new `paymentNote` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new paymentNote item.
var paymentNote = teamsnap.createPaymentNote();

// ~~~~~
// Creates a new paymentNote item with `teamId: 1`.
var paymentNote = teamsnap.createPaymentNote({teamId: 1});
```


---


<a id="savePaymentNote"></a>
## `savePaymentNote(paymentNote, callback)`
Saves a `paymentNote` item.

### Params
* `paymentNote`: [object] - paymentNote item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves paymentNote item.
teamsnap.savePaymentNote(paymentNote);

// ~~~~~
// Creates a new paymentNote then saves it.
var paymentNote = teamsnap.createPaymentNote({
  teamId: 1,
  memberPaymentId: 1,
  noteAuthorUserId: 1,
  note: 'Example payment note.'
});

teamsnap.savePaymentNote(paymentNote);
```
