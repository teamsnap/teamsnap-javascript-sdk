exports.loadTeamStatistics = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamStatistics', 'must provide a
    teamId or query parameters'

  @loadItems 'teamStatistic', params, callback
