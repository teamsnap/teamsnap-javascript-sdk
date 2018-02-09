# Forecasts

## Methods

- [loadForecasts](#loadForecasts)


---
<a id="loadForecasts"></a>
## `loadForecasts(params, callback)`
Loads items from the `forecasts` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.forecasts.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads forecast with `teamId: 1`.
teamsnap.loadForecasts(1);
```
