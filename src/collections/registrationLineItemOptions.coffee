exports.loadRegistrationLineItemOptions = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadRegistrationLineItemOptions','must provide query parameters'

  @loadItems 'registrationLineItemOption', params, callback
