# Partner User Preference

## Methods

- [createPartnerUserPreferences](#createPartnerUserPreferences)
- [savePartnerUserPreferences](#savePartnerUserPreferences)


---
<a id="createPartnerUserPreferences"></a> 
## `createPartnerUserPreferences(data)` 
Creates a new `PartnerUserPreferences` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new `partnerUserPreferences` item with `userId: 1, teamId: 1, partnerPreferenceId: 1, optionValue: 'partner-option-value'`.
var partner_user_preference = teamsnap.createPartnerUserPreferences({userId: 1, teamId: 1, partnerPreferenceId: 1, optionValue: 'partner-option-value'});
```


---


<a id="savePartnerUserPreferences"></a>
## `savePartnerUserPreferences(partnerUserPreference, callback)`
Saves a `partnerUserPreference` item.

### Params
* `partnerUserPreference`: [object] - partnerUserPreference item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves partnerUserPreference item.
teamsnap.savePartnerUserPreferences(partnerUserPreference);

// ~~~~~
// Creates a new partnerUserPreference then saves it.
var partnerUserPreference = teamsnap.createPartnerUserPreferences({
  userId: 1,
  teamId: 1,
  partnerPreferenceId: 1,
  optionValue: 1
});

teamsnap.savePartnerUserPreferences(partnerUserPreference);
```
