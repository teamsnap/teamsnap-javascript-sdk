# Plans

## Methods

- [loadPlans](#loadPlans)
- [loadPlan](#loadPlan)

---
<a id="loadPlans"></a>
## `loadPlans(params, callback)`
Loads items from the `plans` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.plans.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all plans for `teamId: 1`.
teamsnap.loadPlans(1);

// ~~~~~
// Loads plan for `id: 1`.
teamsnap.loadPlans({id: 1});
```


---

<a id="loadPlan"></a>
## `loadPlan(teamId, callback)`
Loads a singular `plan` item based on given params.

### Params
* `teamId`: [int] - a `teamId`.
* `callback`: [function] - callback to be executed when the operation completes.
`

### Examples
```javascript
// ~~~~~
// Loads plan for `teamId: 1`.
teamsnap.loadPlan(1);
```
