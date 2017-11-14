# Advertisements

## Methods

- [loadAdvertisements](#loadAdvertisements)


---
<a id="loadAdvertisements"></a>
## `loadAdvertisements(params, callback)`
Loads items from the `advertisements` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.advertisements.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all `advertisements` for `teamId: 1`.
teamsnap.loadAdvertisements(1);


---
