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
