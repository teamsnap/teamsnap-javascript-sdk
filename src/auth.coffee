teamsnap = require './teamsnap'
request = require './request'
promises = require './promises'
request = require './request'
sdk = require './sdk'
jsonMime = 'application/json'
collectionJSONMime = 'application/vnd.collection+json'
multipartMime = 'multipart/form-data'
browserStorageName = 'teamsnap.authToken'

# Sets up requests for the JSON auth services
authRequest = request.create().hook (xhr, data) ->
  xhr.setRequestHeader('Accept', jsonMime)
  xhr.setRequestHeader('Content-Type', jsonMime) if data
  xhr.withCredentials = true

# Sets up requests for Collection+JSON API calls
sdkRequest = request.create().hook (xhr, data) ->
  xhr.setRequestHeader('Accept', collectionJSONMime)
  if data and not (data instanceof FormData)
    xhr.setRequestHeader('Content-Type', collectionJSONMime)
  xhr.withCredentials = true


# Need 3 types of authentications
# 1. server-side app
# 2. client-side app
# 3. teamsnap app


# Server Flow:
# prep: `auth = teamsnap.init(clientId, secret)` on the server
# 1. create an auth URL using `getServerAuthUrl(redirect, scopes)` and send the
# user to that URL.
# 2. parse code=X from the redirect URL once the user has gone there and call
# `finishServerAuth(code, callback)` to get a token
# 3. store the token for future use. When acting on the user's behalf get an
# SDK object with `auth(token)` to load and save data

# Ajax Server Flow:
# Prep: `auth = teamsnap.init(clientId, secret)` on the server and
# `auth = teamsnap.init(clientId)` in the browser
# 1. create an auth URL using `getServerAuthUrl(redirect, scopes)` and call
# createDialog(url, callback) with that URL in the browser.
# 2. send the code from the dialog's callback to the server using XMLHttpRequest
# and call `finishServerAuth(code, callback)` on the server to get a token
# 3. store the token for future use. When acting on the user's behalf get an
# SDK object with `auth(token)` on the server to load and save data

# Browser Flow:
# Prep: `auth = teamsnap.init(clientId)` in the browser
# 1. create an auth URL using `getBrowserAuthUrl(redirect, scopes)` and call
# createDialog(url, callback) with that URL in the browser.
# 2. call `auth(response.access_token)` with response from the dialog to get a
# SDK object for loading and saving data
# This entire flow is encapsulted in the isAuthed() and startBrowserAuth()
# methods which will store the token temporarily in sessionStorage. Note that
# this should NOT be used when untrusted scripts may be running on the page.

# TeamSnap-owned or CLI apps
# prep: `auth = teamsnap.init(clientId)` on the client
# 1. collect user's username and password
# 2. call `authPassword(username, password, callback)`
# 3. call `auth(response.access_token)` with response from the previous call
# to get a SDK object for loading and saving data



module.exports = (clientId, secret) ->
  unless clientId
    throw new TSError "`teamsnap.init(clientId)` must be called in order to use
      TeamSnap's API. See https://auth.teamsnap.com/ to register an app."


  # Generates urls
  generateUrl = (endpoint, params) ->
    queries = []
    for key, value of params
      if value
        queries.push key + '=' + encodeURIComponent value
    url = teamsnap.authUrl + '/oauth/' + endpoint + '?' + queries.join('&')
    url.replace /%20/g, '+'


  # Generates the auth url for a resource owner to auth a client
  generateAuthUrl = (type, redirect, scopes) ->
    scopes = if Array.isArray(scopes) then scopes.join ' ' else scopes
    generateUrl 'authorize',
      response_type: type
      client_id: clientId
      redirect_uri: redirect
      scope: scopes

  # Generates the auth url for a resource owner to auth a client
  generateTokenUrl = (code) ->
    generateUrl 'token',
      grant_type: 'authorization_code'
      code: code
      client_id: clientId
      client_secret: secret

  # Generates the auth url for a resource owner to auth a client
  generatePasswordUrl = (username, password) ->
    generateUrl 'token',
      grant_type: 'password'
      username: username
      password: password
      client_id: clientId



  # An object which will auth a user and return the SDK
  return {

    # Return an authed SDK object for use with a single authorized user
    auth: (token, cachedCollections, callback) ->
      if typeof token is 'function'
        callback = token
        token = null
      else if typeof token is 'object'
        callback = cachedCollections
        cachedCollections = token
        token = null
      if typeof cachedCollections is 'function'
        callback = cachedCollections
        cachedCollections = null

      # Shortcut for local testing
      if not token and teamsnap.apiUrl.indexOf(':3000') isnt -1
        authedRequest = sdkRequest.clone()
        id = 1
        id = token if typeof token is 'number'
        authedRequest.hook (xhr) ->
          xhr.setRequestHeader 'X-Teamsnap-User-ID', id
        return sdk authedRequest, cachedCollections, callback

      token = browserStore() unless token
      unless token
        throw new TSArgsError 'teamsnap.auth', 'A token is required to auth
        unless in the browser it has been cached'

      authedRequest = sdkRequest.clone()
      authedRequest.hook (xhr) ->
        xhr.setRequestHeader 'X-Teamsnap-Access-Token', token
      sdk authedRequest, cachedCollections, @version, callback

    # Use to generate a URL for getting a code with a server app.
    getServerAuthUrl: (redirect, scopes) ->
      generateAuthUrl 'code', redirect, scopes

    # Use to generate a URL for getting the token with a server app.
    getServerTokenUrl: (code) ->
      generateTokenUrl code

    # Use to generate a URL for getting the token with a browser app.
    getBrowserAuthUrl: (redirect, scopes) ->
      generateAuthUrl 'token', redirect, scopes

    # Use to generate a URL for getting the token with a CLI app.
    getPasswordAuthUrl: (username, password) ->
      generatePasswordUrl username, password

    # Creates an auth dialog opening up the URL and calling the callback once
    # the dialog has finished. This is used for browser flows or ajax server
    # flows
    createDialog: (url, callback) ->
      createAuthDialog url, callback

    # Get the token from a code retrieved.
    finishServerAuth: (code, callback) ->
      authRequest.post @getServerTokenUrl(code), callback

    # Use in a client-side app to authorize a user and get the SDK for that user
    startBrowserAuth: (redirect, scopes, callback) ->
      if location.protocol is 'file:'
        throw new TSError 'TeamSnap.js cannot auth from the file system'
      @createDialog(@getBrowserAuthUrl redirect, scopes).then((response) =>
        token = response.access_token
        browserStore token
        @auth token # returns the SDK
      ).callback callback

    # Get a token for the user with username and password
    startPasswordAuth: (username, password, callback) ->
      authRequest.post @getPasswordAuthUrl(username, password), callback

    # Checks whether the browser has already received authorization for a user
    # by returning the SDK if they're authed
    isAuthed: ->
      !!browserStore()
  }





# Get or save a token into a browser's store
browserStore = (token) ->
  return unless global.sessionStorage
  if arguments.length is 0
    return sessionStorage.getItem browserStorageName
  else
    sessionStorage.setItem browserStorageName, token
    return


# Creates a dialog in browser for oauth
createAuthDialog = (url, callback) ->
  width = 860
  height = 720

  deferred = promises.defer()

  # Center the dialog over the current window
  x = window.screenLeft or window.screenX
  y = window.screenTop or window.screenY
  windowWidth = window.innerWidth or
    document.documentElement.clientWidth or
    document.body.clientWidth
  windowHeight = window.innerHeight or
    document.documentElement.clientHeight or
    document.body.clientHeight
  left = x + (windowWidth - width) / 2
  top = y + (windowHeight - height) / 2
  dialog = window.open(
    url
    'oauth',
    'menubar=no,scrollbars=no,status=no,toolbar=no,'+
    'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top
  )

  # Wait until the dialog is done
  interval = setInterval ->
    try
      if dialog.closed
        clearInterval interval
        deferred.reject {
          error: 'access_denied'
          error_description: 'The resource owner denied the request.'
        }
      return unless dialog.location.host is location.host
      params = dialog.location.hash.replace(/^#/, '') or
               dialog.location.search.replace(/^\?/, '')
    catch e
      return
    clearInterval interval
    dialog.close()
    response = {}
    params.split('&').forEach (param) ->
      [key, value] = param.split('=')
      response[decodeURIComponent(key)] =
        decodeURIComponent(value.replace(/\+/g, ' '))
    if response.error
      deferred.reject(response)
    else
      deferred.resolve(response)
  , 50
  return deferred.promise.callback callback
