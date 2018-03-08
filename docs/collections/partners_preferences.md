# Partners Preferences

## Methods

- [loadPartnersPreferences](#loadPartnersPreferences)


---
<a id="loadPartnersPreferences"></a>
## `loadPartnersPreferences(params, callback)`
Loads items from the `partnersPreferences` collection based on given params.

_Note: This is based on a `member` - so it requires either a `memberId` or the combination of `teamId` and `userId` to derive the `member` object for which
this pertains._

### Params
* `params`: [int, object] - can be either a `memberId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.partnersPreferences.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads `partnerPreferences` for `teamId: 1, userId: 1`.
teamsnap.loadPartnersPreferences({teamId: 1, memberId: 1});


---
