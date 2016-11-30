exports.loadMemberRegistrationSignups = (params, callback) ->
  if @isId params
    params = id: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberRegistrationSignups',
      'must provide a id or query parameters'

  @loadItems 'memberRegistrationSignup', params, callback
