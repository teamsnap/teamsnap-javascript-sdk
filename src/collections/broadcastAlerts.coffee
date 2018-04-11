exports.loadBroadcastAlerts = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadBroadcastAlerts', 'must provide a
      teamId or query parameters'

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

  if broadcastAlert.isLeague
    unless broadcastAlert.divisionId
      return reject 'You must provide a division id.', 'divisionId', callback
  else
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
    throw new TSArgsError 'teamsnap.deleteBroadcastAlert', '`broadcastAlert`
      must be provided'

  @deleteItem broadcastAlert, callback

exports.bulkDeleteBroadcastAlerts = (broadcastAlertIds, callback) ->
  unless (Array.isArray(broadcastAlertIds))
    throw new TSArgsError 'teamsnap.broadcastAlertIds',
      'You must provide an array of broadcastAlert IDs'

  @collections.broadcastAlerts.exec(
    'bulkDelete', id: broadcastAlertIds, callback
  )
