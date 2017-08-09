exports.loadRegistrationLineItemOptions = (params, callback) ->
  if @isId params
    params = teamId: params
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadRegistrationLineItemOptions',
      'must provide a teamId or','must provide query parameters'

  @loadItems 'registrationLineItemOption', params, callback
