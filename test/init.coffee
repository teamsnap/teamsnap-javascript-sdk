chai.should()
window.expect = chai.expect

authSection = document.getElementById('auth')
authButton = document.getElementById('auth-button')
apiInput = document.getElementById('api-url')
authInput = document.getElementById('auth-url')
clientIdInput = document.getElementById('client-id')
clientId = '1d228d706ce170d61f9368b5967bd7a1641e6ecf742434dc198047f1a36a930a'
redirect = 'http://localhost:8000/'
scopes = [
  'read'
  'write'
]

if (url = localStorage.getItem 'teamsnap.apiUrl')
  apiInput.value = url if url

if (url = localStorage.getItem 'teamsnap.authUrl')
  authInput.value = url if url

id = localStorage.getItem 'teamsnap.clientId'
clientId = id or clientId
clientIdInput.value = clientId

teamsnap.apiUrl = apiInput.value
teamsnap.authUrl = authInput.value
teamsnap.clientId = clientIdInput.value

apiInput.addEventListener 'change', ->
  teamsnap.apiUrl = apiInput.value
  localStorage.setItem 'teamsnap.apiUrl', apiInput.value

authInput.addEventListener 'change', ->
  teamsnap.authUrl = authInput.value
  localStorage.setItem 'teamsnap.authUrl', authInput.value

clientIdInput.addEventListener 'change', ->
  clientId = clientIdInput.value
  teamsnap.init clientId if clientId
  localStorage.setItem 'teamsnap.clientId', clientId

whenAuthed = ->
  authSection.parentNode.removeChild authSection
  sessionStorage.setItem 'collections', JSON.stringify(teamsnap.collections)
  mocha.setup('bdd')
  window.require.list().filter((_) -> /^test/.test(_)).forEach(require)
  mocha.run()
whenAuthFailed = (err) ->
  authSection.style.display = ''

authButton.addEventListener 'click', ->
  authSection.style.display = 'none'
  teamsnap.startBrowserAuth(redirect, scopes)
    .then(teamsnap.loadCollections)
    .then(whenAuthed, whenAuthFailed)


teamsnap.init clientId

if teamsnap.hasSession()
  authSection.style.display = 'none'
  try
    collections = JSON.parse sessionStorage.getItem 'collections'
  teamsnap.auth()
  teamsnap.loadCollections(collections).then(whenAuthed, whenAuthFailed)
