exports.loadUsers = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadUsers', 'must provide a teamId or
      query parameters'

  @loadItems 'user', params, callback


exports.loadMe = (callback) ->
  @collections.root.queryItem('me', callback)


exports.saveUser = (user, callback) ->
  unless user
    throw new TSArgsError 'teamsnap.saveUser', "`user` must be provided"
  unless @isItem user, 'user'
    throw new TSArgsError 'teamsnap.saveUser', "`user.type` must be
      'user'"
  unless user.email?.trim()
    return @reject 'You must provide an email for the user.', 'email', callback

  @saveItem user, callback


exports.sendEmailValidation = (params = {}, callback) ->
  if Object.keys(params).length and !(params.teamId? and @isId params.teamId)
    throw new TSArgsError 'teamsnap.sendEmailValidation', 'if a params object is
      used, it must contain a teamId'

  @collections.users.exec('sendEmailValidation', params).pop().callback callback

exports.dspPayload = (params, callback) ->
  if @isId params
    params = memberId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.dspPayload', 'must provide a memberId'
  
  @collections.users.queryItems('dspPayload',  params, callback)
