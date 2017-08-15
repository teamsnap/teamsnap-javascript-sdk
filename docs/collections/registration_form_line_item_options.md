# Registration Form Line Item Options

## Methods

- [loadRegistrationFormLineItemOptions](#loadRegistrationFormLineItemOptions)

---
<a id="loadRegistrationFormLineItemOptions"></a>
## `loadRegistrationFormLineItemOptions(params, callback)`
Loads items from the `registrationFormItemOptions` collection based on given params.

### Params
* `params`: [object] - an object of query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.registrationFormLineItems.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all sponsors for `divisionId: 1`.
teamsnap.loadRegistrationFormLineItems({ divisionId: 1});
