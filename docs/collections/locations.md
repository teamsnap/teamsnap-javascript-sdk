# Locations

## Methods

- [loadLocations](#loadLocations)
- [createLocation](#createLocation)
- [saveLocation](#saveLocation)
- [deleteLocation](#deleteLocation)


---
<a id="loadLocations"></a>
## `loadLocations(params, callback)`
Loads items from the `locations` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.locations.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all locations for `teamId: 1`.
teamsnap.loadLocations(1);

// ~~~~~
// Loads location for `id: 1`.
teamsnap.loadLocations({id: 1});
```


---


<a id="createLocation"></a>
## `createLocation(data)`
Creates a new `location` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new location item.
var location = teamsnap.createLocation();

// ~~~~~
// Creates a new location item with `teamId: 1`.
var location = teamsnap.createLocation({teamId: 1});
```


---


<a id="saveLocation"></a>
## `saveLocation(location, callback)`
Saves a `location` item.

### Params
* `location`: [object] - location item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves location item.
teamsnap.saveLocation(location);

// ~~~~~
// Creates a new location then saves it.
var location = teamsnap.createLocation({
  teamId: 1,
  name : 'Example Location'
});

teamsnap.saveLocation(location);
```


---


<a id="deleteLocation"></a>
## `deleteLocation(location, callback)`
Deletes a `location` item.

### Params
* `location`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a location item.
teamsnap.deleteLocation(location);

// ~~~~~
// Creates a new location, saves, then deletes it.
var location = teamsnap.createLocation({
  teamId: 1,
  name : 'Example Location'
});

teamsnap.saveLocation(location).then(function(){
  // Save complete, now delete.
  teamsnap.deleteLocation(location).then(function(){
    // Poof! It's gone!
  });
});
```
