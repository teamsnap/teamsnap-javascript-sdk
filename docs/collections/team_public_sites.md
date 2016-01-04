# Team Public Sites

## Methods

- [loadTeamPublicSites](#loadTeamPublicSites)
- [loadTeamPublicSite](#loadTeamPublicSite)
- [saveTeamPublicSite](#saveTeamPublicSite)
- [uploadTeamPublicPhoto](#uploadTeamPublicPhoto)
- [deleteTeamPublicPhoto](#deleteTeamPublicPhoto)
- [validateSubdomain](#validateSubdomain)


---
<a id="loadTeamPublicSites"></a>
## `loadTeamPublicSites(params, callback)`
Loads items from the `teamPublicSites` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamPublicSites.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all teamPublicSites for `teamId: 1`.
teamsnap.loadTeamPublicSites(1);

// ~~~~~
// Loads a teamPublicSite for `id: 1`.
teamsnap.loadTeamPublicSites({id: 1});
```


---


<a id="loadTeamPublicSite"></a>
## `loadTeamPublicSites(params, callback)`
Loads a singular `teamPublicSite` item based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.teamPublicSites.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads a teamPublicSite for `id: 1`.
teamsnap.loadTeamPublicSite({id: 1});
```


---


<a id="saveTeamPublicSite"></a>
## `saveTeamPublicSite(teamPublicSite, callback)`
Saves a `teamPublicSite` item.

### Params
* `teamPublicSite`: [object] - teamPublicSite item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves teamPublicSite item.
teamsnap.saveTeamPublicSite(teamPublicSite);
```


---


<a id="uploadTeamPublicPhoto"></a>
## `uploadTeamPublicPhoto(teamPublicSiteId, file, callback)`
Uploads a file for a team's public home page.

### Params
* `teamPublicSiteId`: [int] - a `teamPublicSiteId` to upload the photo to.
* `file`: [file (object)] - file to be uploaded.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Uploads a team photo.
teamsnap.uploadTeamPublicPhoto(teamPublicSiteId, file);
```


---


<a id="deleteTeamPublicPhoto"></a>
## `deleteTeamPublicPhoto(teamPublicSiteId, callback)`
Deletes the public home photo for a team based on the given `teamPublicSiteId`.

### Params
* `teamPublicSiteId`: [int] - a `teamPublicSiteId` from which the photo should be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a team's public photo
teamsnap.deleteTeamPublicPhoto(teamPublicSiteId);
```


---


<a id="validateSubdomain"></a>
## `validateSubdomain(subdomain, callback)`
Ensures that a given subdomain (`teamPublicSite.subdomain`) is not only valid, but also available for use.

### Params
* `subdomain`: [string] - a subdomain to validate.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a team's public photo
teamsnap.validateSubdomain(teamPublicSiteId);
```
