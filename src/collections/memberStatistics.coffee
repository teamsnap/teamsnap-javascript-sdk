exports.loadMemberStatistics = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberStatistics', 'must provide a
    teamId or query parameters'

  @loadItems 'memberStatistic', params, callback
