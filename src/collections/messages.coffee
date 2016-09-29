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
    throw new TSArgsError 'teamsnap.markMessageAsRead',
      'a message `id` or `message` object must be provided'

  @collections.messages.exec('markMessageAsRead', params)
    .pop().callback callback

exports.bulkDeleteMessages = (params, callback) ->
  if !Array.isArray params
    throw new TSArgsError 'teamsnap.bulkDeleteMessages',
      'an array of `messages` must be provided'

  requestParams = { id: [] }
  for msg in params
    unless @isItem msg, 'message'
      throw new TSArgsError 'teamsnap.bulkDeleteMessages',
        "Items in params array must have a 'message' `type`"
    id = msg.id
    requestParams.id.push id

  @collections.messages.exec('bulkDelete', requestParams).callback callback
