exports.loadRegistrationLineItems = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadRegistrationLineItems', 'must provide query parameters'

  @loadItems 'registrationLineItem', params, callback
