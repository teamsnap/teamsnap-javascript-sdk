exports.loadRegistrationLineItems = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.registrationLineItems',
      'must provide query parameters'

  @loadItems 'registrationLineItems', params, callback
