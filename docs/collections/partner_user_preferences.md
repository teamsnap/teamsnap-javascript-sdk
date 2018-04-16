# Partner User Preference

## Methods

- [createPartnerUserPreference](#createPartnerUserPreference)
- [savePartnerUserPreference](#savePartnerUserPreference)

---
<a id="createPartnerUserPreference"></a> 
## `createPartnerUserPreference(data)` 
Creates a new `PartnerUserPreference` item.

### Params
* `data`: [object, null] - data object to apply to the newly created object.

### Examples
```javascript
// ~~~~~
// Creates a new `partnerUserPreferences` item with `userId: 1, teamId: 1, partnerPreferenceId: 1, optionValue: 'partner-option-value'`.
var partner_user_preference = teamsnap.createPartnerUserPreference({userId: 1, teamId: 1, partnerPreferenceId: 1, optionValue: 'partner-option-value'});
```

---
<a id="savePartnerUserPreference"></a>
## `savePartnerUserPreference(partnerUserPreference, callback)`
Saves a `partnerUserPreference` item.

### Params
* `partnerUserPreference`: [object] - partnerUserPreference item to be saved.
* `callback`: [function] - callback to be executed when the operation completes.

### Examples
```javascript
// ~~~~~
// Saves partnerUserPreference item.
teamsnap.savePartnerUserPreference(partnerUserPreference);

// ~~~~~
// Creates a new partnerUserPreference then saves it.
var partnerUserPreference = teamsnap.createPartnerUserPreference({
  userId: 1,
  teamId: 1,
  partnerPreferenceId: 1,
  optionValue: 1
});

teamsnap.savePartnerUserPreference(partnerUserPreference);
```

