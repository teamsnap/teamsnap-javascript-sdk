# Registration Form Line Items

## Methods

- [loadRegistrationFormLineItems](#loadRegistrationFormLineItems)

---
<a id="loadRegistrationFormLineItems"></a>
## `loadRegistrationFormLineItems(params, callback)`
Loads items from the `registrationFormItems` collection based on given params.

### Params
* `params`: [object] - or an object of query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.registrationFormLineItems.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all sponsors for `divisionId: 1`.
teamsnap.loadRegistrationFormLineItems({ divisionId: 1});
