exports.loadEventStatistics = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadEventStatistics', 'must provide a
      teamId or query parameters'

  @loadItems 'eventStatistic', params, callback
