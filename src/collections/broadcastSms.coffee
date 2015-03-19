exports.loadBroadcastSmses = (params, callback) ->
  if @isId params
    params = id: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadBroadcastSmses', 'must provide an id
      or query parameters'

  @loadItems 'broadcastSms', params, callback

exports.createBroadcastSms = (data) ->
  @createItem data,
    type: 'broadcastSms'

exports.saveBroadcastSms = (broadcastSms, callback) ->
  unless broadcastSms
    throw new TSArgsError 'teamsnap.saveBroadcastSms', "`broadcastSms` must
      be provided"
  unless @isItem broadcastSms, 'broadcastSms'
    throw new TSArgsError 'teamsnap.saveBroadcastSms', "`type` must
      be 'broadcastSms'"
  unless broadcastSms.teamId
    return @reject 'You must provide a team id.', 'teamId', callback
  unless broadcastSms.memberId
    return @reject 'You must provide a member id.', 'memberId', callback
  unless broadcastSms.body?.trim()
    return @reject 'You must provide the text alert body.',
      'body', callback

  @saveItem broadcastSms, callback

exports.deleteBroadcastSms = (broadcastSms, callback) ->
  unless broadcastSms
    throw new TSArgsError 'teamsnap.deleteBroadcastSms', '`broadcastSms` must
      be provided'

  @deleteItem broadcastSms, callback
