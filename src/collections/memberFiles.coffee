
exports.loadMemberFiles = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberFiles', 'must provide a teamId or
      query parameters'

  @loadItems 'memberFile', params, callback


exports.createMemberFile = (data) ->
  @createItem data,
    type: 'memberFile'


exports.saveMemberFile = (memberFile, callback) ->
  unless memberFile
    throw new TSArgsError 'teamsnap.saveMemberFile', '`memberFile`
      must be provided'
  unless @isItem memberFile, 'memberFile'
    throw new TSArgsError 'teamsnap.saveMemberFile',
      "`memberFile.type` must be 'memberFile'"
  unless memberFile.memberId
    return @reject 'You must choose a member.', 'memberId', callback

  @saveItem memberFile, callback


exports.deleteMemberFile = (memberFile, callback) ->
  unless memberFile
    throw new TSArgsError 'teamsnap.deleteMemberFile',
      '`memberFile` must be provided'

  @deleteItem memberFile, callback


exports.uploadMemberFile = (memberFileId, file, callback) ->
  if @isItem memberFileId, 'memberFile'
    memberFileId = memberFileId.id
  if typeof FormData is 'undefined'
    @reject 'Your browser does not support the new file upload APIs', 'file',
      callback
  unless @isId memberFileId
    throw new TSArgsError 'teamsnap.uploadMemberFile', 'must include
      `memberFileId`'
  unless file instanceof File
    throw new TSArgsError 'teamsnap.uploadMemberFile', 'must include
      `file` as type File'

  params = memberFileId: memberFileId, file: file
  @collections.memberFiles.exec('uploadMemberFile', params)
    .pop().callback callback
