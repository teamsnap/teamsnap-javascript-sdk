exports.loadTeamMediaGroups = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamMediaGroups', 'must provide a
    teamId or query parameters'

  @loadItems 'teamMediaGroup', params, callback


exports.createTeamMediaGroup = (data) ->
  @createItem data,
    type: 'teamMediaGroup'


exports.saveTeamMediaGroup = (teamMediaGroup, callback) ->
  unless teamMediaGroup
    throw new TSArgsError 'teamsnap.saveTeamMediaGroup', "`teamMediaGroup` must
      be provided"
  unless @isItem teamMediaGroup, 'teamMediaGroup'
    throw new TSArgsError 'teamsnap.saveTeamMediaGroup',
      "`teamMediaGroup.type` must be 'teamMediaGroup'"

  @saveItem teamMediaGroup, callback


exports.reorderTeamMediaGroups = (teamId, teamMediaGroupIds, callback) ->
  unless @isId teamId
    throw new TSArgsError 'teamsnap.reorderTeamMediaGroups', '`teamId`
      must be provided'
  unless teamMediaGroupIds and Array.isArray teamMediaGroupIds
    throw new TSArgsError 'teamsnap.reorderTeamMediaGroups', 'You must provide
      an array of ordered Team Media Group IDs'

  params = teamId: teamId, sortedIds: teamMediaGroupIds
  @collections.teamMediaGroups.exec('reorderTeamMediaGroups', params)
    .callback callback


# Share teamMediaGroup on an associated Facebook page that YOU manage
exports.facebookShareTeamMediaGroup = (teamMediaGroupId, facebookPageId,
  isSuppressedFromFeed, albumName, callback) ->
    # If a facebookPageId is not present, APIv3 will assume you're
    # posting to your personal profile.
    if typeof facebookPageId is 'boolean'
      callback = albumName
      albumName = isSuppressedFromFeed
      isSuppressedFromFeed = facebookPageId
      facebookPageId = null
    # Album Name is optional
    if typeof albumName is 'function'
      callback = albumName

    if facebookPageId?
      facebookPageId = parseInt facebookPageId

    if @isItem teamMediaGroupId, 'teamMedium'
      teamMediaGroupId = teamMediaGroup.id

    unless isSuppressedFromFeed? and typeof isSuppressedFromFeed is 'boolean'
      throw new TSArgsError 'teamsnap.facebookShareMediaGroup', 'must include
      boolean isSuppressedFromFeed'

    params = {
      teamMediaGroupId: teamMediaGroupId,
      facebookPageId: facebookPageId,
      albumName: albumName,
      isSuppressedFromFeed: isSuppressedFromFeed
    }

    @collections.teamMediaGroups.exec('facebookShareTeamMediaGroup', params)
      .pop().callback callback
