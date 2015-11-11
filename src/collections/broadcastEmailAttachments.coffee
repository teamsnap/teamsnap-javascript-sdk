exports.loadBroadcastEmailAttachments = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadBroadcastEmailAttachments', 'must
      provide a teamId or query parameters'

  @loadItems 'broadcastEmailAttachment', params, callback

exports.deleteBroadcastEmailAttachment = (broadcastEmailAttachment, callback) ->
  unless broadcastEmailAttachment
    throw new TSArgsError 'teamsnap.deleteBroadcastEmailAttachment',
      '`broadcastEmailAttachment` must be provided'

  @deleteItem broadcastEmailAttachment, callback

exports.uploadBroadcastEmailAttachment = (broadcastEmailId, memberId, file,
  progressCallback, callback) ->
    if typeof FormData is 'undefined'
      @reject 'Your browser does not support the new file upload APIs.', 'file',
        callback
    unless broadcastEmailId
      throw new TSArgsError 'teamsnap.uploadBroadcastEmailAttachment',
        'broadcastEmailId is required'
    unless file instanceof File
      throw new TSArgsError 'teamsnap.uploadBroadcastEmailAttachment',
        'must include `file` as type File', 'file is required'
    unless memberId
      throw new TSArgsError 'teamsnap.uploadBroadcastEmailAttachment',
        'memberId is required'

    params = broadcastEmailId: broadcastEmailId, file: file, memberId: memberId

    @collections.broadcastEmailAttachments
    .file('uploadBroadcastEmailAttachment', params, progressCallback, callback)
