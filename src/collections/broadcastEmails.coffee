exports.loadBroadcastEmails = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadBroadcastEmails', 'must provide a
      teamId or query parameters'

  @loadItems 'broadcastEmail', params, callback

exports.createBroadcastEmail = (data) ->
  @createItem data,
    type: 'broadcastEmail'

exports.saveBroadcastEmail = (broadcastEmail, callback) ->
  unless broadcastEmail
    throw new TSArgsError 'teamsnap.saveBroadcastEmail', "`broadcastEmail` must
      be provided"

  unless @isItem broadcastEmail, 'broadcastEmail'
    throw new TSArgsError 'teamsnap.saveBroadcastEmail', "`type` must
      be 'broadcastEmail'"
  if broadcastEmail.isLeague
    unless broadcastEmail.divisionId
      return reject 'You must provide a division id.', 'divisionId', callback
  else
    unless broadcastEmail.teamId
      return @reject 'You must provide a team id.', 'teamId', callback
  unless broadcastEmail.memberId
    return @reject 'You must provide a member id.', 'memberId', callback
  unless broadcastEmail.body?.trim()
    return @reject 'You must provide the text alert body.', 'body', callback
  unless broadcastEmail.isDraft
    unless broadcastEmail.isLeague # recipients are more complicated for league
      unless (Array.isArray(broadcastEmail.recipientIds) and
      broadcastEmail.recipientIds.length > 0)
        return @reject 'You must provide at least one recipient.',
          'recipientIds'

  @saveItem broadcastEmail, callback

exports.deleteBroadcastEmail = (broadcastEmail, callback) ->
  unless broadcastEmail
    throw new TSArgsError 'teamsnap.deleteBroadcastEmail', '`broadcastEmail`
      must be provided'

  @deleteItem broadcastEmail, callback

exports.bulkDeleteBroadcastEmails = (broadcastEmailIds, callback) ->
  unless (Array.isArray(broadcastEmailIds))
    throw new TSArgsError 'teamsnap.broadcastEmailIds',
      'You must provide an array of broadcastEmail IDs'

  @collections.broadcastEmails.exec(
    'bulkDelete', id: broadcastEmailIds, callback
  )
