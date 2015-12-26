# Sponsors

## Methods

- [loadSponsors](#loadSponsors)
- [createSponsor](#createSponsor)
- [saveSponsor](#saveSponsor)
- [deleteSponsor](#deleteSponsor)
- [uploadSponsorLogo](#uploadSponsorLogo)
- [deleteSponsorLogo](#deleteSponsorLogo)


---
<a id="loadSponsors"></a>
## `loadSponsors(params, callback)`
Loads items from the `sponsors` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.sponsors.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all sponsors for `teamId: 1`.
teamsnap.loadSponsors(1);

// ~~~~~
// Loads all sponsors for `id: 1`.
teamsnap.loadSponsors({id: 1});
```


---


<a id="createSponsor"></a>
## `createSponsor(data)`
Creates a new `sponsor` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new sponsor item.
var sponsor = teamsnap.createSponsor();

// ~~~~~
// Creates a new sponsor item with `name: 'Example Sponsor'`.
var sponsor = teamsnap.createSponsor({name: 'Example Sponsor'});
```


---


<a id="saveSponsor"></a>
## `saveSponsor(sponsor, callback)`
Saves a `sponsor` item.

### Params
* `sponsor`: [object] - sponsor item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves sponsor item.
teamsnap.saveSponsor(sponsor);

// ~~~~~
// Creates a new sponsor then saves it.
var sponsor = teamsnap.createSponsor({
  teamId: 1,
  name: 'Example Sponsor',
  url: 'http://www.example.com'
});

teamsnap.saveSponsor(sponsor);
```


---


<a id="deleteSponsor"></a>
## `deleteSponsor(sponsor, callback)`
Deletes a `sponsor` item.

### Params
* `sponsor`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a sponsor item.
teamsnap.deleteSponsor(sponsor);

// ~~~~~
// Creates a new sponsor, saves, then deletes it.
var sponsor = teamsnap.createSponsor({
  teamId: 1,
  name: 'Example Sponsor',
  url: 'http://www.example.com'
});

teamsnap.saveSponsor(sponsor).then(function(){
  // Save complete, now delete.
  teamsnap.deleteSponsor(sponsor).then(function(){
    // Poof! It's gone!
  });
});
```


---


<a id="uploadSponsorLogo"></a>
## `uploadSponsorLogo(sponsorId, file, callback)`
Uploads a logo file and attaches to a `sponsor` item.

### Params
* `sponsorId`: [int, object] - a sponsorId or a sponsor item to upload the file to.
* `file`: [file (object)] - file to be uploaded.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Uploads a file for a sponsor item.
teamsnap.uploadSponsorLogo(sponsorId, file);
```


---


<a id="deleteSponsorLogo"></a>
## `uploadSponsorLogo(sponsorId, callback)`
Deletes logo file for a `sponsor` item.

### Params
* `sponsorId`: [int, object] - a sponsorId or a sponsor item to remove the file from.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a file for a sponsor item.
teamsnap.deleteSponsorLogo(sponsorId);
```
