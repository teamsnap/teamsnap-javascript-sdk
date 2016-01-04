exports.loadStatisticAggregates = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadStatisticAggregates', 'must provide a
    teamId or query parameters'

  @loadItems 'statisticAggregate', params, callback
