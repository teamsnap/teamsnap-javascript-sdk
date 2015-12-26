# Member Phone Numbers

## Methods

- [loadMemberPhoneNumbers](#loadMemberPhoneNumbers)
- [createMemberPhoneNumber](#creatememberPhoneNumber)
- [saveMemberPhoneNumber](#saveMemberPhoneNumber)
- [deleteMemberPhoneNumber](#deleteMemberPhoneNumber)


---
<a id="loadMemberPhoneNumbers"></a>
## `loadMemberPhoneNumbers(params, callback)`
Loads items from the `memberPhoneNumbers` collection based on given params.

### Params
* `params`: [int, object] - can be either a `teamId` or an object with query parameters.
* `callback`: [function] - callback to be executed when the operation completes.

To see a list of all available search params you can run:
`teamsnap.collections.memberPhoneNumbers.queries.search.params`

### Examples
```javascript
// ~~~~~
// Loads all memberPhoneNumbers for `teamId: 1`.
teamsnap.loadMemberPhoneNumbers(1);

// ~~~~~
// Loads all memberPhoneNumbers for `memberId: 1`.
teamsnap.loadMemberPhoneNumbers({memberId: 1});
```


---


<a id="creatememberPhoneNumber"></a>
## `creatememberPhoneNumber(data)`
Creates a new `memberPhoneNumber` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new memberPhoneNumber item.
var memberPhoneNumber = teamsnap.creatememberPhoneNumber();

// ~~~~~
// Creates a new memberPhoneNumber item with `memberId: 1` and `phoneNumber: '1231231234'`.
var memberPhoneNumber = teamsnap.creatememberPhoneNumber({memberId: 1, phoneNumber: '1231231234'});
```


---


<a id="saveMemberPhoneNumber"></a>
## `saveMemberPhoneNumber(memberPhoneNumber, callback)`
Saves a `memberPhoneNumber` item.

### Params
* `memberPhoneNumber`: [object] - memberPhoneNumber item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves memberPhoneNumber item.
teamsnap.saveMemberPhoneNumber(memberPhoneNumber);

// ~~~~~
// Creates a new memberPhoneNumber then saves it.
var memberPhoneNumber = teamsnap.creatememberPhoneNumber({
  memberId: 1,
  phoneNumber: '1231231234'
});

teamsnap.saveMemberPhoneNumber(memberPhoneNumber);
```


---


<a id="deleteMemberPhoneNumber"></a>
## `deleteMemberPhoneNumber(memberPhoneNumber, callback)`
Deletes a `memberPhoneNumber` item.

### Params
* `memberPhoneNumber`: [object] - an item to be deleted.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Deletes a memberPhoneNumber item.
teamsnap.deleteMemberPhoneNumber(memberPhoneNumber);

// ~~~~~
// Creates a new memberPhoneNumber, saves, then deletes it.
var memberPhoneNumber = teamsnap.creatememberPhoneNumber({
  memberId: 1,
  phoneNumber: '1231231234'
});

teamsnap.saveMemberPhoneNumber(memberPhoneNumber).then(function(){
  // Save complete, now delete.
  teamsnap.deleteMemberPhoneNumber(memberPhoneNumber).then(function(){
    // Poof! It's gone!
  });
});
```
