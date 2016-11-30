exports.loadRegistrationForms = (params, callback) ->
  if @isId params
    params = id: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadRegistrationForms', 'must provide a
      id or query parameters'

  @loadItems 'registrationForm', params, callback
