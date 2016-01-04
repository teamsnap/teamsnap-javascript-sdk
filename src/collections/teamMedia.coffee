exports.ROTATION_DIRECTIONS =
  CLOCKWISE: 'clockwise'
  COUNTERCLOCKWISE: 'counterclockwise'

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


exports.deleteTeamMedium = (teamMedium, callback) ->
  unless teamMedium
    throw new TSArgsError 'teamsnap.deleteTeamMedium',
      '`teamMedium` must be provided'

  @deleteItem teamMedium, callback


exports.saveTeamMedium = (teamMedium, callback) ->
  unless teamMedium
    throw new TSArgsError 'teamsnap.saveTeamMedium', "`teamMedium` must be
    provided"
  unless @isItem teamMedium, 'teamMedium'
    throw new TSArgsError 'teamsnap.saveTeamMedium', "`type` must be
      'teamMedium'"
  unless @isId teamMedium.teamId
    throw new TSArgsError 'teamsnap.saveTeamMedium', 'must include
      `teamId`'
  unless @isId teamMedium.memberId
    throw new TSArgsError 'teamsnap.saveTeamMedium', 'must include
      `memberId`'
  unless @isId teamMedium.teamMediaGroupId
    throw new TSArgsError 'teamsnap.saveTeamMedium', 'must include
      `teamMediaGroupId`'

  @saveItem teamMedium, callback


exports.saveTeamVideoLink = (teamMedium, callback) ->
  unless teamMedium
    throw new TSArgsError 'teamsnap.createVideoLink', "`teamMedium` must be
      provided"
  unless @isItem teamMedium, 'teamMedium'
    throw new TSArgsError 'teamsnap.createVideoLink', "`type` must be
      'teamMedium'"
  unless @isId teamMedium.teamId
    throw new TSArgsError 'teamsnap.createVideoLink', 'must include
      `teamId`'
  unless @isId teamMedium.teamMediaGroupId
    throw new TSArgsError 'teamsnap.createVideoLink', 'must include
      `teamMediaGroupId`'

  @collections.teamMedia.exec('createTeamVideoLink', teamMedium)
    .pop().callback callback


exports.bulkDeleteTeamMedia = (teamMediumIds, callback) ->
  unless teamMediumIds
    throw new TSArgsError 'teamsnap.bulkDeleteTeamMedia',
      "`teamMediumIds` must be provided"

  params =
    teamMediumIds: teamMediumIds
  @collections.teamMedia.exec('bulkDeleteTeamMedia', params).callback callback


# This accepts a `teamMediaGroupId`, but in order to take advantage of some
# persistence features, you'll need to provide a `teamMediaGroup` object instead
exports.assignMediaToGroup = (teamMediumIds, teamMediaGroupId, callback) ->
  unless teamMediumIds
    throw new TSArgsError 'teamsnap.assignMediaToGroup', 'must provide
      teamMediumIds'
  if @isItem teamMediaGroupId, 'teamMediaGroup'
    teamMediaGroupId = teamMediaGroupId.id
  unless teamMediaGroupId and @isId teamMediaGroupId
    throw new TSArgsError 'teamsnap.assignMediaToGroup', 'must provide a
    teamMediaGroupId'

  params =
    teamMediumIds: teamMediumIds
    teamMediaGroupId: teamMediaGroupId

  @collections.teamMedia.exec('assignMediaToGroup', params)
    .callback callback


exports.rotateTeamMediumImage = (teamMediumId, rotateDirection, callback) ->
  if @isItem teamMediumId, 'teamMedium'
    teamMediumId = teamMediumId.id
  unless teamMediumId and @isId teamMediumId
    throw new TSArgsError 'teamsnap.rotateTeamMediumImage', 'must provide a
    teamMediumId'
  unless rotateDirection
    throw new TSArgsError 'teamsnap.rotateTeamMediumImage', 'must provide a
    rotateDirection'
  params =
    teamMediumId: teamMediumId
    rotateDirection: rotateDirection

  @collections.teamMedia.exec('rotateTeamMediumImage', params)
    .pop().callback callback

# This accepts a `teamMediumId`, but in order to take advantage of some
# persistence features, you'll need to provide a `teamMedium` object instead
exports.setMediumAsTeamPhoto = (teamMediumId, callback) ->
  if @isItem teamMediumId, 'teamMedium'
    teamMediumId = teamMediumId.id
  unless teamMediumId and @isId teamMediumId
    throw new TSArgsError 'teamsnap.setMediumAsTeamPhoto', 'must include a
    teamMediumId'
  params = teamMediumId: teamMediumId

  @collections.teamMedia.exec('setMediumAsTeamPhoto', params)
    .pop().callback callback


# This accepts a `memberId`, but in order to take advantage of some
# persistence features, you'll need to provide a `member` object instead
exports.setMediumAsMemberPhoto = (teamMediumId, memberId, callback) ->
  if @isItem teamMediumId, 'teamMedium'
    teamMediumId = teamMediumId.id
  if @isItem memberId, 'member'
    memberId = memberId.id
  unless teamMediumId and @isId teamMediumId
    throw new TSArgsError 'teamsnap.setMediumAsMemberPhoto', 'must include a
    teamMediumId'
  unless memberId and @isId memberId
    throw new TSArgsError 'teamsnap.setMediumAsMemberPhoto', 'must include a
    memberId'
  params = teamMediumId: teamMediumId, memberId: memberId

  @collections.teamMedia.exec('setMediumAsMemberPhoto', params)
    .pop().callback callback


exports.reorderTeamMedia = (teamId, teamMediaIds, callback) ->
  unless @isId teamId
    throw new TSArgsError 'teamsnap.reorderTeamMedia', '`teamId`
      must be provided'
  unless teamMediaIds and Array.isArray teamMediaIds
    throw new TSArgsError 'teamsnap.reorderTeamMedia', 'You must provide
      an array of ordered Team Medium IDs'

  params = teamId: teamId, sortedIds: teamMediaIds
  @collections.teamMedia.exec('reorderTeamMedia', params)
    .callback callback


# Share teamMedium on an associated Facebook page that YOU manage
exports.facebookShareTeamMedium = (teamMediumId, facebookPageId,
  isSuppressedFromFeed, caption, callback) ->
    # If a facebookPageId is not present, APIv3 will assume you're
    # posting to your personal profile.
    if typeof facebookPageId is 'boolean'
      callback = caption
      caption = isSuppressedFromFeed
      isSuppressedFromFeed = facebookPageId
      facebookPageId = null
    # Caption is optional
    if typeof caption is 'function'
      callback = caption

    if facebookPageId?
      facebookPageId = parseInt facebookPageId

    if @isItem teamMediumId, 'teamMedium'
      teamMediumId = teamMediumId.id

    unless isSuppressedFromFeed? and typeof isSuppressedFromFeed is 'boolean'
      throw new TSArgsError 'teamsnap.facebookShareMedium', 'must include
      boolean isSuppressedFromFeed'

    params = {
      teamMediumId: teamMediumId,
      facebookPageId: facebookPageId,
      caption: caption,
      isSuppressedFromFeed: isSuppressedFromFeed
    }

    @collections.teamMedia.exec('facebookShareTeamMedium', params)
      .pop().callback callback
