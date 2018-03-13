# Partners Preferences

## Methods

- [loadPartnersPreferences](#loadPartnersPreferences)

---
<a id="loadPartnersPreferences"></a>
## `loadPartnersPreferences(params, callback)`
Loads items from the `partnersPreferences` collection based on given params.

### Params
* `params`: [int, object] - an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.partnersPreferences.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads `partnerPreferences` for `teamId: 1, userId: 1`.
teamsnap.loadPartnersPreferences({teamId: 1, memberId: 1});


---
