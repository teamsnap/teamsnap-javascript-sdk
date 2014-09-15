chai.should()
window.expect = chai.expect

authSection = document.getElementById('auth')
authButton = document.getElementById('auth-button')
apiInput = document.getElementById('api-url')
authInput = document.getElementById('auth-url')
clientId = '1d228d706ce170d61f9368b5967bd7a1641e6ecf742434dc198047f1a36a930a'
redirect = 'http://localhost:8000/'
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

if typeof localStorage isnt 'undefined' and
    (url = localStorage.getItem 'teamsnap.apiUrl')
  apiInput.value = url if url

if typeof localStorage isnt 'undefined' and
    (url = localStorage.getItem 'teamsnap.authUrl')
  authInput.value = url if url

teamsnap.apiUrl = apiInput.value
teamsnap.authUrl = authInput.value

apiInput.addEventListener 'change', ->
  teamsnap.apiUrl = apiInput.value
  if typeof localStorage isnt 'undefined'
    localStorage.setItem 'teamsnap.apiUrl', apiInput.value

authInput.addEventListener 'change', ->
  teamsnap.authUrl = authInput.value
  if typeof localStorage isnt 'undefined'
    localStorage.setItem 'teamsnap.authUrl', authInput.value

whenAuthed = (sdk) ->
  authSection.parentNode.removeChild authSection
  sessionStorage.setItem 'collections', JSON.stringify(sdk.collections)
  window.teamsnap = sdk
  mocha.setup('bdd')
  window.require.list().filter((_) -> /^test/.test(_)).forEach(require)
  mocha.run()
whenAuthFailed = (sdk) ->
  authSection.style.display = ''

authButton.addEventListener 'click', ->
  authSection.style.display = 'none'
  teamsnap.startBrowserAuth(redirect, scopes).then whenAuthed, whenAuthFailed


teamsnap.init clientId

if teamsnap.isAuthed()
  authSection.style.display = 'none'
  try
    collections = JSON.parse sessionStorage.getItem 'collections'
  teamsnap.auth(collections).then whenAuthed, whenAuthFailed
