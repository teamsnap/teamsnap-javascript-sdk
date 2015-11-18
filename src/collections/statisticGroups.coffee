exports.loadStatisticGroups = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadStatisticGroups', 'you must provide a
    a teamId or query parameters'

  @loadItems 'statisticGroup', params, callback


exports.createStatisticGroup = (data) ->
  @createItem data,
    type: 'statisticGroup'


exports.saveStatisticGroup = (statisticGroup, callback) ->
  unless statisticGroup
    throw new TSArgsError 'teamsnap.saveStatisticGroup', '`statisticGroup`
      must be provided'
  unless @isItem statisticGroup, 'statisticGroup'
    throw new TSArgsError 'teamsnap.saveStatisticGroup',
      "`statisticGroup.type` must be 'statisticGroup'"
  unless statisticGroup.name
    return @reject 'You must specify a name', 'name', callback
  unless statisticGroup.teamId
    return @reject 'You must specify a team', 'teamId', callback

  @saveItem statisticGroup, callback


exports.deleteStatisticGroup = (statisticGroup, callback) ->
  unless statisticGroup
    throw new TSArgsError 'teamsnap.deleteStatisticGroup',
      '`statisticGroup` must be provided'

  @deleteItem statisticGroup, callback


exports.reorderStatisticGroups = (teamId, statisticGroupIds, callback) ->
  unless @isId teamId
    throw new TSArgsError 'teamsnap.reorderStatisticGroups', '`teamId`
      must be provided'
  unless statisticGroupIds and Array.isArray statisticGroupIds
    throw new TSArgsError 'teamsnap.reorderStatisticGroups', 'You must provide
      an array of ordered Statistic Group IDs'

  params = teamId: teamId, sortedIds: statisticGroupIds
  @collections.statisticGroups.exec('reorderStatisticGroups', params)
    .callback callback
