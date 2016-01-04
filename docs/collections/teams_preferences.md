# Teams Preferences

## Methods

- [loadTeamsPreferences](#loadTeamsPreferences)
- [loadTeamPreferences](#loadTeamPreferences)
- [saveTeamPreferences](#saveTeamPreferences)
- [uploadTeamPhoto](#uploadTeamPhoto)
- [deleteTeamPhoto](#deleteTeamPhoto)
- [uploadTeamLogo](#uploadTeamLogo)
- [deleteTeamLogo](#deleteTeamLogo)



---
<a id="loadTeamsPreferences"></a>
## `loadTeamsPreferences(params, callback)`
Loads items from the `teamsPreferencess` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamsPreferencess.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teamPreferencess for `teamId: 1`.
teamsnap.loadTeamsPreferences(1);

// ~~~~~
// Loads teamPreferences for `id: 1`.
teamsnap.loadTeamsPreferences({id: 1});
```


---


<a id="loadTeamPreferences"></a>
## `loadTeamsPreferences(params, callback)`
Loads a singular `teamPreferences` item based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamsPreferencess.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads teamPreferences for `id: 1`.
teamsnap.loadTeamPreferences({id: 1});
```


---


<a id="saveTeamPreferences"></a>
## `saveTeamPreferences(teamPreferences, callback)`
Saves a `teamPreferences` item.

### Params
* `teamPreferences`: [object] - teamPreferences item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves teamPreferences item.
teamsnap.saveTeamPreferences(teamPreferences);
```


---


<a id="uploadTeamPhoto"></a>
## `uploadTeamPhoto(teamPreferencesId, file, callback)`
Uploads a team photo.

### Params
* `teamPreferencesId`: [int] - a `teamPreferencesId` to upload the photo to.
* `file`: [file (object)] - file to be uploaded.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Uploads a team photo.
teamsnap.uploadTeamPhoto(teamPreferencesId, file);
```


---


<a id="deleteTeamPhoto"></a>
## `deleteTeamPhoto(teamPreferencesId, callback)`
Deletes the team photo for a team based on the given `teamPreferencesId`.

### Params
* `teamPreferencesId`: [int] - a `teamPreferencesId` from which the photo should be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a team's  photo.
teamsnap.deleteTeamPhoto(teamPreferencesId);
```


---


<a id="uploadTeamLogo"></a>
## `uploadTeamLogo(teamPreferencesId, file, callback)`
Uploads a team logo.

### Params
* `teamPreferencesId`: [int] - a `teamPreferencesId` to upload the logo to.
* `file`: [file (object)] - file to be uploaded.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Uploads a team photo.
teamsnap.uploadTeamLogo(teamPreferencesId, file);
```


---


<a id="deleteTeamLogo"></a>
## `deleteTeamLogo(teamPreferencesId, callback)`
Deletes the team logo for a team based on the given `teamPreferencesId`.

### Params
* `teamPreferencesId`: [int] - a `teamPreferencesId` from which the logo should be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a team's  photo.
teamsnap.deleteTeamLogo(teamPreferencesId);
```
