# General TeamSnap error
class TSError extends Error
  constructor: (message) ->
    super()
    @name = 'TeamSnapError'
    @message = message

# Error used when there are missing arguments or arguments of the wrong type
class TSArgsError extends TypeError
  constructor: (method, msg) ->
    super()
    @name = 'TeamSnapArgumentError'
    @message = "Failed to execute `#{method}`: #{msg}."

# Error used for validation errors in forms
class TSValidationError extends RangeError
  constructor: (message, field) ->
    super()
    @name = 'TeamSnapValidationError'
    @message = message
    @field = field

# Error used when there was a problem from the server
class TSServerError extends Error
  constructor: (message) ->
    super()
    @name = 'TeamSnapServerError'
    @message = message or
               'An unknown error occurred on TeamSnap\'s server.'

  @create: (message, jqxhr) -> new TSServerError(message, jqxhr)


global.TSError = TSError
global.TSArgsError = TSArgsError
global.TSValidationError = TSValidationError
global.TSServerError = TSServerError
