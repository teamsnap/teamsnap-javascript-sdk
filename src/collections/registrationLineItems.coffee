exports.loadRegistrationLineItems = (params, callback) ->
  if @isId params
    params = teamId: params
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadRegistrationLineItems', 'must provide a teamId or',
      'must provide query parameters'

  @loadItems 'registrationLineItem', params, callback
