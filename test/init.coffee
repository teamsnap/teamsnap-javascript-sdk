mocha.setup('bdd')
window.require.list().filter((_) -> /^test/.test(_)).forEach(require)
mocha.checkLeaks()

authSection = document.getElementById('auth')
authButton = document.getElementById('auth-button')
clientId = '1d228d706ce170d61f9368b5967bd7a1641e6ecf742434dc198047f1a36a930a'
redirect = 'http://localhost:8000/test/'
scopes = [
  'read'
  'write_contacts'
  'write_contact_email_addresses'
  'write_events'
  'write_locations'
  'write_opponents'
  'write_refreshments'
  'write_rosters'
  'write_roster_email_addresses'
  'write_rosters_preferences'
  'write_teams'
  'write_teams_preferences'
  'write_teams_results'
  'write_tracked_items'
  'write_tracked_item_statuses'
]

whenAuthed = (sdk) ->
  authSection.parentNode.removeChild authSection
  teamsnap = sdk
  mocha.run()
whenAuthFailed = (sdk) ->
  authSection.style.display = ''

authButton.addEventListener 'click', ->
  authSection.style.display = 'none'
  teamsnap.startBrowserAuth(redirect, scopes).then whenAuthed, whenAuthFailed


teamsnap.init clientId

if teamsnap.isAuthed()
  authSection.style.display = 'none'
  teamsnap.auth().then whenAuthed, whenAuthFailed
else
  authButton.addEventListener 'click', ->
    teamsnap.startBrowserAuth(redirect, scopes).then (sdk) ->
    authSection.parentNode.removeChild authSection
    teamsnap = sdk
    mocha.run()