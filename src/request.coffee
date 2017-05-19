# use node.js version when in node
if typeof XMLHttpRequest is 'undefined'
  global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
FormData = global.FormData or ->
promises = require './promises'
stringent = require './stringent'

# -- THIS IS A BETA FEATURE AND IS SUBJECT TO CHANGE -- #
# -- IT IS HIGHLY RECOMMENDED THIS IS NOT USED IN A PRODUCTION APPLICATION -- #
eventEmitter = require './eventEmitter'

# Request
sendRequest = (method, url, data, hooks, callback) ->
  # -- BETA -- #
  if teamsnap?.useEventEmitter
    requestId = method + (new Date).getTime()
    eventEmitter.requestStart(requestId, method, url, data)
  # -------- #
  # Query string
  if data and method.toUpperCase() is 'GET'
    query = []
    for key, value of data
      query.push encodeURIComponent(key) + '=' + encodeURIComponent(value)
    if query.length
      url += if url.indexOf('?') is -1 then '?' else '&'
      url += query.join('&')
  else if typeof data is 'object' and not (data instanceof FormData)
    data = JSON.stringify data

  xhr = new XMLHttpRequest()
  xhr.open(method.toUpperCase(), url)
  if hooks
    hook(xhr, data) for hook in hooks
  deferred = promises.defer()
  xhr.onreadystatechange = ->
    switch xhr.readyState
      when 3
        deferred.progress(xhr)
      when 4
        try
          xhr.data = JSON.parse(stringent(xhr.responseText))
        catch
          xhr.data = null

        if xhr.status >= 400
          errorMsg = xhr.data?.collection?.error?.message or ''

          # -- BETA -- #
          if teamsnap?.useEventEmitter
            eventEmitter.requestError(requestId, method, url, data, errorMsg)
          # -------- #

        if xhr.status is 0
          return promises.defer().promise if unloading
          deferred.reject new RequestError(RequestError.CONNECTION_ERROR,
            'Could not connect to the server'), xhr, errorMsg
        else if xhr.status >= 500
          console.error "TeamSnap API error: #{errorMsg}" if global.console
          deferred.reject new RequestError(RequestError.SERVER_ERROR, 'Error
            with the server'), xhr, errorMsg
        else if xhr.status > 400
          deferred.reject new RequestError(RequestError.CLIENT_ERROR, 'There
            was an error with the request'), xhr, errorMsg
        else if xhr.status is 400
          deferred.reject new RequestError(RequestError.VALIDATION_ERROR,
            errorMsg or 'The data was invalid'), xhr
        else
          deferred.resolve xhr
          # -- BETA -- #
          if teamsnap?.useEventEmitter
            eventEmitter.requestResponse(requestId, method, xhr)
          # -------- #

  xhr.send(data or null)
  deferred.promise.callback callback


createRequest = (hooks = []) ->
  request = (method, url, data, callback) ->
    if typeof data is 'function'
      callback = data
      data = null
    sendRequest method, url, data, hooks, callback
  request.get = (url, params, callback) ->
    request 'get', url, params, callback
  request.post = (url, params, callback) ->
    request 'post', url, params, callback
  request.put = (url, params, callback) ->
    request 'put', url, params, callback
  request.delete = (url, params, callback) ->
    request 'delete', url, params, callback
  request.create = ->
    createRequest()
  request.clone = ->
    createRequest hooks.slice()
  request.reset = ->
    hooks = []
    this
  request.hook = (hook) ->
    hooks.push hook
    this
  request.removeHook = (hook) ->
    index = hooks.indexOf hook
    hooks.splice(index, 1) if index isnt -1
    this
  return request


module.exports = createRequest()


# Error class
class RequestError extends Error
  @CONNECTION_ERROR: 1
  @SERVER_ERROR: 2
  @CLIENT_ERROR: 3
  @VALIDATION_ERROR: 4

  constructor: (@code, @message) ->
    super()
    @name = 'RequestError'


# Don't give errors when unloading the page
if typeof window isnt 'undefined'
  unloading = false
  window.addEventListener 'beforeunload', ->
    unloading = true
    return
