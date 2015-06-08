exports.loadBroadcastEmails = (params, callback) ->
  if @isId params
    params = id: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadBroadcastEmails', 'must provide an id
      or query parameters'

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
  unless broadcastEmail.teamId
    return @reject 'You must provide a team id.', 'teamId', callback
  unless broadcastEmail.memberId
    return @reject 'You must provide a member id.', 'memberId', callback
  unless broadcastEmail.body?.trim()
    return @reject 'You must provide the text alert body.',
      'body', callback

  @saveItem broadcastEmail, callback

exports.deleteBroadcastEmail = (broadcastEmail, callback) ->
  unless broadcastEmail
    throw new TSArgsError 'teamsnap.deleteBroadcastEmail', '`broadcastEmail`
      must be provided'

  @deleteItem broadcastEmail, callback

exports.uploadAttachment = (broadcastEmailId, file, callback) ->
  if typeof FormData is 'undefined'
    @reject 'Your browser does not support the new file upload APIs.', 'file',
      callback
  unless file
    throw new TSArgsError 'teamsnap.uploadAttachment',
      'file is required'
  unless broadcastEmailId
    throw new TSArgsError 'teamsnap.uploadAttachment',
      'broadcastEmailId is required'

  params = broadcastEmailId: broadcastEmailId, file: file

  @collections.broadcastEmails.exec('uploadAttachment', params)
