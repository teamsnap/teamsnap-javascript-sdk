exports.loadMessages = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMessages', 'must provide a
      teamId or query parameters'

  @loadItems 'message', params, callback

exports.markMessageAsRead = (params, callback) ->
  if typeof params is 'object'
    params = id: params.id
  else if @isId params
    params = id: params
  else
    throw new TSArgsError 'teamsnap.markMessageAsRead', 'a message `id` or `message` object must be provided'

  @collections.messages.exec('markMessageAsRead', params)
    .pop().callback callback