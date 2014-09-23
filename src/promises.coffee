# if not used in modules allow use in global scope
promises = if typeof exports isnt 'undefined' then exports else this

# The promise of a an action to be resolved with methods to respond to that
# action after it is finished. The action may happen synchronously or
# asynchronously.

class Promise

  # Allows responding to an action once it is resolved or rejected. Allows
  # responding to progress updates as well. A promise may or may not choose to
  # provide progress updates.
  then: (resolvedHandler, rejectedHandler, progressHandler, cancelHandler) ->
    throw new TypeError 'The Promise base class is abstract, this function is
      overwritten by the promise\'s deferred object'

  callback: (callback) ->
    if callback and typeof callback is 'function'
      @then (results...) ->
        callback null, results...
      , (err) ->
        callback err
    this

  # Specific method for only passing a resolved handler.
  resolved: (handler) -> @then handler
  done: (handler) -> @then handler


  # Specific method for only passing a rejected handler.
  rejected: (handler) -> @then null, handler
  fail: (handler) -> @then null, handler


  # Handler called whever this promise is resolved or rejected.
  always: (handler) ->
    resolvedHandler = (res) -> handler(null, res)
    rejectedHandler = (err) -> handler(err)
    @then resolvedHandler, rejectedHandler


  # Specific method for only passing a progress handler.
  progress: (handler) -> @then null, null, handler


  # Specific method for only passing a canceled handler.
  canceled: (handler) -> @then null, null, null, handler



  # Apply the promise's result array to the handler optionally providing a
  # context.
  #
  # @param handler resolved handler
  # @param [context] Optional context object

  apply: (handler, context) ->
    @then (result) ->
      if (result instanceof Array) handler.apply context or this, result
      else handler.call context or this, result




  # Allows the cancellation of a promise. Some promises are cancelable and so
  # this method may be created on
  # subclasses of Promise to allow a consumer of the promise to cancel it.
  #
  # @return {String|Error} Error string or object to provide to rejectHandlers

  cancel: ->
    throw new TypeError 'The Promise base class is abstract, this function is
      overwritten by the promise\'s deferred object'


  # A shortcut to return the value of a property from the returned promise
  # results. The same as providing your own
  # <code>promise.then (obj) -> obj.propertyName</code> method.
  #
  # @param {String} propertyName The name of the property to return
  # @return {Promise} The new promise for the property value

  get: (propertyName) ->
    @then (object) ->
      object?[propertyName]




  # A shortcut to set the property from the returned promise results to a
  # certain value. The same as providing your
  # own <code>promise.then (obj) -> obj.propertyName = value; return obj</code>
  # method. This returns the
  # original promise results after setting the property as opposed to
  # <code>put</code> which returns the value which
  # was set.
  #
  # @param {String} propertyName The name of the property to set
  # @param {mixed} value The value for the property to be set to
  # @return {Promise} A new promise with the original results

  set: (propertyName, value) ->
    @then (object) ->
      object?[propertyName] = value
      return object



  # A shortcut to set the property from the returned promise results to a
  # certain value. The same as providing your own <code>promise.then (obj) ->
  # return obj.propertyName = value</code> method. This returns the new value
  # after setting the property as opposed to <code>set</code> which returns the
  # original promise results.
  #
  # @param {String} propertyName The name of the property to set
  # @param {mixed} value The value for the property to be set to
  # @return {Promise} A new promise with the value

  put: (propertyName, value) ->
    @then (object) ->
      object?[propertyName] = value



  # A shortcut to call a method on the returned promise results. The same as
  # providing your own <code>promise.then (obj) -> obj.functionName(); return
  # obj</code> method. This returns the original results after calling the
  # function as opposed to <code>call</code> which returns the function's
  # results.
  #
  # @param {String} functionName The name of the function to call
  # @param {mixed} [...arguments] Zero or more arguments to pass to the function
  # @return {Promise} A new promise with the original results

  run: (functionName, params...) ->
    @then (object) ->
      object?[functionName] params...
      return object



  # A shortcut to call a method on the returned promise results. The same as
  # providing your own <code>promise.then (obj, rest...) -> obj.functionName
  # rest...</code> method. This returns the function's results after calling the
  # function as opposed to <code>run</code> which returns the original results.
  #
  # @param {String} functionName The name of the function to call
  # @param {mixed} [...arguments] Zero or more arguments to pass to the function
  # @return {Promise} A new promise with the original results

  call: (functionName, params...) =>
    @then (object) ->
      object[functionName](params...)


# Add array methods which have a return result onto promise for async array
# handling
['pop', 'shift', 'splice', 'filter', 'every', 'map', 'some'].forEach (method) ->
  Promise::[method] = (args...) ->
    @then (object) ->
      object?[method]?(args...)

# Add array methods which have no return onto promise for async array handling
['push', 'reverse', 'sort', 'unshift', 'forEach'].forEach (method) ->
  Promise::[method] = (args...) ->
    @then (object) ->
      if object instanceof Array then object[method](args...)
      return object


Promise.extend = (methods) ->
  SubPromise = ->
  SubPromise.extend = @extend
  SubPromise.prototype = new @()
  if methods
    for own name, value of methods
      SubPromise::[name] = value
  SubPromise

# Combines one or more methods behind a promise. If the methods return a promise
# <code>when</code> will wait until they are finished to complete its promise.
#
# Example:
# <code>when(method1(), method2()).then (result1, result2) -> # handle...</code>
# both methods have finished and the results from their promises are available

promises.when = (params...) ->
  deferred = promises.defer()
  count = params.length
  rejected = false
  resolvedCallback = ->
  rejectedCallback = (value) ->
    rejected = true
    value

  createCallback = (index) ->
    (results...) ->
      params[index] = if results.length > 1 then results else results[0]

      if --count is 0
        if rejected
          deferred.reject params...
        else
          deferred.resolve params...


  for obj, name in params
    if obj and typeof obj.then is 'function'
      alwaysCallback = createCallback(name)
      obj.then resolvedCallback, rejectedCallback
      obj.then alwaysCallback, alwaysCallback
    else
      --count

  if count is 0
    deferred.resolve params...

  deferred.promise



# Allows returning multiple values from a method that will be passed in as
# arguments in any methods handling the promise.
#
# @param ...arguments to be passed in

args = (params...) ->
  params.isArgs = true
  params



# Represents a deferred action with an associated promise.
#
# @param promise Allow for custom promises to be used with deferred.

class Deferred
  constructor: (promise = new promises.Promise) ->
    @promise = promise
    @status = 'pending'
    @progressHandlers = []
    @handlers = []

    # overwrite the promise's then with the deferred's for deferred to handle
    promise.then = @then
    promise.cancel = @cancel
    promise.getStatus = => @status


  # handle a promise whether it was resolved, rejected, and/or its progress
  then: (resolvedHandler, rejectedHandler, progressHandler, canceledHandler) =>
    for handler in arguments
      if handler? and typeof handler isnt 'function'
        throw new Error('Promise handlers must be functions')

    @progressHandlers.push(progressHandler) if progressHandler
    nextDeferred = promises.defer()
    nextDeferred.promise.prev = @.promise
    @_addHandler(resolvedHandler, rejectedHandler, canceledHandler)
      .nextDeferred = nextDeferred
    if @finished()
      handler = @handlers.pop()
      method = handler[@status]
      deferred = handler.nextDeferred
      unless method
        deferred[@status](@results...)
      else
        nextResult = method(@results...)
        if nextResult and typeof nextResult.then is 'function'
          nextResult.then deferred.resolve, deferred.reject
        else
          deferred[@status](nextResult)
    return nextDeferred.promise


  # whether or not the deferred is finished processing
  finished: => @status != 'pending'


  # successfully resolve this deferred's promise.
  resolve: (results...) =>
    return if @status isnt 'pending'
    if results[0]?.isArgs then results = results[0]
    clearTimeout @_timeout
    @status = 'resolve'
    @results = results
    while (handler = @handlers.shift())
      method = handler[@status]
      deferred = handler.nextDeferred
      unless method
        deferred[@status](@results...)
      else
        nextResult = method(@results...)
        if nextResult and typeof nextResult.then is 'function'
          nextResult.then deferred.resolve, deferred.reject
        else
          deferred[@status](nextResult)
    return


  # reject this deferred's promise
  reject: (results...) =>
    return if @status isnt 'pending'
    if results[0]?.isArgs then results = results[0]
    clearTimeout @_timeout
    @status = 'reject'
    @results = results
    while (handler = @handlers.shift())
      method = handler[@status]
      deferred = handler.nextDeferred
      unless method
        deferred[@status](@results...)
      else
        nextResult = method(@results...)
        if nextResult and typeof nextResult.then is 'function'
          nextResult.then deferred.resolve, deferred.reject
        else
          deferred[@status](nextResult)
    return


  # cancel this deferred's promise
  cancel: (results...) =>
    return if @status isnt 'pending'
    if results[0]?.isArgs then results = results[0]
    clearTimeout @_timeout
    @status = 'cancel'
    @results = results
    while (handler = @handlers.shift())
      method = handler[@status]
      deferred = handler.nextDeferred
      unless method
        deferred[@status](@results...)
      else
        nextResult = method(@results...)
        if nextResult and typeof nextResult.then is 'function'
          nextResult.then deferred.resolve, deferred.reject
        else
          deferred[@status](nextResult)
    @promise.prev?.cancel()
    return


  # update progress on this deferred's promise
  progress: (params...) =>
    for progress in @progressHandlers
      progress params...


  # set a timeout for this deferred to auto-reject
  timeout: (milliseconds, error) ->
    clearTimeout @_timeout

    @_timeout = setTimeout =>
      @reject error ? new Error 'Operation timed out'
    , milliseconds


  # reset this deferred dropping all handlers and resetting status
  reset: ->
    @status = 'pending'
    @progressHandlers = []
    @handlers = []


  _addHandler: (resolvedHandler, rejectedHandler, canceledHandler) ->
    handler =
      resolve: resolvedHandler
      reject: rejectedHandler
      cancel: canceledHandler
    @handlers.push(handler)
    handler


promises.Deferred = Deferred
promises.Promise = Promise
promises.args = args

# returns a new instance of Deferred
promises.defer = (promise) -> new promises.Deferred(promise)

# call a method that takes a callback returning the promise
promises.wrap = (method, PromiseClass) ->
  (args...) ->
    promise = if PromiseClass then new PromiseClass()
    deferred = promises.defer promise
    if typeof args[args.length - 1] is 'function'
      callback = args.pop()

    args.push (err, result) ->
      extras = Array::slice.call(arguments, 2)
      callback(err, result, extras...) if callback
      if err then deferred.reject err else deferred.resolve result, extras...

    method.apply @, args
    deferred.promise

# shortcuts to create synchronous rejected and resolved promises, e.g. for
# cached results
promises.resolve = (args...) ->
  deferred = promises.defer()
  deferred.resolve args...
  deferred.promise

promises.reject = (args...) ->
  deferred = promises.defer()
  deferred.reject args...
  deferred.promise
