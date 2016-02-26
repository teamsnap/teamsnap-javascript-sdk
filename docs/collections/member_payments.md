# Member Payments

## Methods

- [loadMemberPayments](#loadMemberPayments)
- [saveMemberPayment](#saveMemberPayment)
- [memberPaymentTransaction](#memberPaymentTransaction)


---
<a id="loadMemberPayments"></a>
## `loadMemberPayments(params, callback)`
Loads items from the `memberPayments` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.memberPayments.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all memberPayments for `teamId: 1`.
teamsnap.loadMemberPayments(1);

// ~~~~~
// Loads all memberPayments for `member: 1`.
teamsnap.loadMemberPayments({memberId: 1});
```


---


<a id="saveMemberPayment"></a>
## `saveMemberPayment(memberPayment, callback)`
Saves a `memberPayment` item.

_Note: In previous versions, you could use this method to add a payment transaction
by setting the amount paid. This has been deprecated with the creation of the
`memberPaymentTransaction` method (see documentation below)._

### Params
* `memberPayment`: [object] - memberPayment item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves memberPayment item.
teamsnap.saveMemberPayment(memberPayment);
```


---


<a id="memberPaymentTransaction"></a>
## `memberPaymentTransaction(memberPaymentId, amount, note, callback)`
Creates a `memberPaymentTransaction`.

### Params
* `memberPaymentId`: [id, object] - `memberPaymentId` or `memberPayment` item to be saved.
* `amount`: [int] - `memberPayment.amountPaid`.
* `note`: [string] - optional string.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Creates memberPaymentTransaction.
teamsnap.memberPaymentTransaction(1, 5.00, 'paid by check');
```
