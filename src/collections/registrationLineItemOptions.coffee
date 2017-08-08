exports.loadRegistrationLineItemOptions = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.registrationLineItemOptions',
      'must provide query parameters'

  @loadItems 'registrationLineItemOptions', params, callback
