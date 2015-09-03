exports.loadTeamMedia = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamMedia', 'must provide a
    teamId or query parameters'

  @loadItems 'teamMedium', params, callback


exports.createTeamMedium = (data) ->
  @createItem data,
    type: 'teamMedium'


exports.uploadTeamMedium = (teamMedium, progressCallback, callback) ->
  unless teamMedium
    throw new TSArgsError 'teamsnap.uploadTeamMedium', "`teamMedium` must be
      provided"
  unless @isItem teamMedium, 'teamMedium'
    throw new TSArgsError 'teamsnap.uploadTeamMedium', "`type` must be
      'teamMedium'"
  unless @isId teamMedium.teamId
    throw new TSArgsError 'teamsnap.uploadTeamMedium', 'must include
      `teamId`'
  unless @isId teamMedium.teamMediaGroupId
    throw new TSArgsError 'teamsnap.uploadTeamMedium', 'must include
      `teamMediaGroupId`'
  unless teamMedium.file instanceof File
    throw new TSArgsError 'teamsnap.uploadTeamMedium', 'must include
      `file` as type File'

  @collections.teamMedia.file('uploadTeamMedium', teamMedium, progressCallback)
    .pop().callback callback


exports.assignMediaToGroup = (teamMediumId, teamMediaGroupId, callback) ->
  unless teamMediumId and @isId teamMediumId
    throw new TSArgsError 'teamsnap.assignMediaToGroup', 'must provide a
    teamMediumId'
  unless teamMediaGroupId and @isId teamMediaGroupId
    throw new TSArgsError 'teamsnap.assignMediaToGroup', 'must provide a
    teamMediaGroupId'
  params =
    teamMediumId: teamMediumId
    teamMediaGroupId: teamMediaGroupId

  @collections.teamMedia.exec('assignMediaToGroup', params)
    .pop().callback callback


exports.removeMediaFromGroup = (teamMediumId, teamMediaGroupId, callback) ->
  unless teamMediumId and @isId teamMediumId
    throw new TSArgsError 'teamsnap.removeMediaFromGroup', 'must provide a
    teamMediumId'
  unless teamMediaGroupId and @isId teamMediaGroupId
    throw new TSArgsError 'teamsnap.removeMediaFromGroup', 'must provide a
    teamMediaGroupId'
  params =
    teamMediumId: teamMediumId
    teamMediaGroupId: teamMediaGroupId

  @collections.teamMedia.exec('removeMediaFromGroup', params)
    .pop().callback callback


exports.rotateTeamMediumImage = (teamMediumId, rotateDirection) ->
  unless teamMediumId and @isId teamMediumId
    throw new TSArgsError 'teamsnap.rotateTeamMediumImage', 'must provide a
    teamMediumId'
  unless rotateDirection
    throw new TSArgsError 'teamsnap.rotateTeamMediumImage', 'must provide a
    rotateDirection'
  params =
    teamMediumId: teamMediumId
    rotateDirection: rotateDirection

  @collections.teamMedia.exec('rotateImageTeamMedium', params)
    .pop().callback callback
