exports.loadDivisionMessages = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionMessages', 'must provide a
      teamId or query parameters'

  @loadItems 'divisionMessage', params, callback

exports.markDivisionMessageAsRead = (params, callback) ->
  if typeof params is 'object'
    params = id: params.id
  else if @isId params
    params = id: params
  else
    throw new TSArgsError 'teamsnap.markDivisionMessageAsRead',
      'a message `id` or `message` object must be provided'

  @collections.messages.exec('markDivisionMessageAsRead', params)
    .pop().callback callback