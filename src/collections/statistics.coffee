exports.loadStatistics = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadStatistics', 'must provide a teamId or
      query parameters'

  @loadItems 'statistic', params, callback


exports.createStatistic = (data) ->
  @createItem data,
    type: 'statistic'


exports.saveStatistic = (statistic, callback) ->
  unless statistic
    throw new TSArgsError 'teamsnap.saveStatistic', '`statistic`
      must be provided'
  unless @isItem statistic, 'statistic'
    throw new TSArgsError 'teamsnap.saveStatistic',
      "`statistic.type` must be 'statistic'"
  unless statistic.name
    return @reject 'You must specify a name.', 'name', callback
  unless statistic.acronym
    return @reject 'You must specify an acronym.', 'acronym', callback
  unless statistic.teamId
    return @reject 'You must choose a team.', 'teamId', callback

  @saveItem statistic, callback


exports.deleteStatistic = (statistic, callback) ->
  unless statistic
    throw new TSArgsError 'teamsnap.deleteStatistic',
      '`statistic` must be provided'

  @deleteItem statistic, callback


exports.reorderStatistics = (statisticIds, callback) ->
  unless statisticIds and typeof statisticIds is 'object'
    throw new TSArgsError 'teamsnap.reorderStatistics', 'You must provide an
      array of ordered Statistic IDs'
  
  params = sortedIds: statisticIds
  @collections.statistics.exec('reorder', statisticIds)
    .callback callback