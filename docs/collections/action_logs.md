# Action Logs

## Methods

- [teamImportCompleted](#teamImportCompleted)

---
<a id="teamImportCompleted"></a>
## `teamImportCompleted(teamId, importedRostersCount)`
Command to record a completed team import.

### Params
* `teamId`: [int, object] - a `teamId`.
* `importedRostersCount`: [int, object] - the total number of rosters imported.

### Examples
```javascript
// ~~~~~
// Sends team import completion action: `team_id: 1`, `imported_rosters_count: 50`
teamsnap.teamImportCompleted(1, 50);
```

Sends import info to `action_logs` collections.

---
