# Member Links

## Methods

- [loadMemberLinks](#loadMemberLinks)
- [createMemberLink](#createMemberLink)
- [saveMemberLink](#saveMemberLink)
- [deleteMemberLink](#deleteMemberLink)


---
<a id="loadMemberLinks"></a>
## `loadMemberLinks(params, callback)`
Loads items from the `memberLinks` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.memberLinks.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all memberLinks for `teamId: 1`.
teamsnap.loadMemberLinks(1);

// ~~~~~
// Loads all memberLinks for `memberId: 1`.
teamsnap.loadMemberLinks({memberId: 1});
```


---


<a id="createMemberLink"></a>
## `createMemberLink(data)`
Creates a new `memberLink` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new memberLink item.
var memberLink = teamsnap.createMemberLink();

// ~~~~~
// Creates a new memberLink item with `contactId: 1` and `phoneNumber: 1`.
var memberLink = teamsnap.createMemberLink({memberId: 1});
```


---


<a id="saveMemberLink"></a>
## `saveMemberLink(memberLink, callback)`
Saves a `memberLink` item.

### Params
* `memberLink`: [object] - memberLink item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves memberLink item.
teamsnap.saveMemberLink(memberLink);

// ~~~~~
// Creates a new memberLink then saves it.
var memberLink = teamsnap.createMemberLink({
  memberId: 1,
  url: 'www.example.com',
  description: 'Example Link'
});

teamsnap.saveMemberLink(memberLink);
```


---


<a id="deleteMemberLink"></a>
## `deleteMemberLink(memberLink, callback)`
Deletes a `memberLink` item.

### Params
* `memberLink`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a memberLink item.
teamsnap.deleteMemberLink(memberLink);

// ~~~~~
// Creates a new memberLink, saves, then deletes it.
var memberLink = teamsnap.createMemberLink({
  memberId: 1,
  url: 'www.example.com',
  description: 'Example Link'
});

teamsnap.saveMemberLink(memberLink).then(function(){
  // Save complete, now delete.
  teamsnap.deleteMemberLink(memberLink).then(function(){
    // Poof! It's gone!
  });
});
```
