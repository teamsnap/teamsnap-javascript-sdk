exports.loadBroadcastAlerts = (params, callback) ->
  if @isId params
    params = id: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadBroadcastAlerts', 'must provide an id
      or query parameters'

  @loadItems 'broadcastAlert', params, callback

exports.createBroadcastAlert = (data) ->
  @createItem data,
    type: 'broadcastAlert'

exports.saveBroadcastAlert = (broadcastAlert, callback) ->
  unless broadcastAlert
    throw new TSArgsError 'teamsnap.saveBroadcastAlert', "`broadcastAlert` must
      be provided"
  unless @isItem broadcastAlert, 'broadcastAlert'
    throw new TSArgsError 'teamsnap.saveBroadcastAlert', "`type` must
      be 'broadcastAlert'"
  unless broadcastAlert.teamId
    return @reject 'You must provide a team id.', 'teamId', callback
  unless broadcastAlert.memberId
    return @reject 'You must provide a member id.', 'memberId', callback
  unless broadcastAlert.body?.trim()
    return @reject 'You must provide the text alert body.',
      'body', callback

  @saveItem broadcastAlert, callback

exports.deleteBroadcastAlert = (broadcastAlert, callback) ->
  unless broadcastAlert
    throw new TSArgsError 'teamsnap.deleteBroadcastAlert', '`broadcastAlert` must
      be provided'

  @deleteItem broadcastAlert, callback
