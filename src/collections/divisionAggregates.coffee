exports.loadDivisionAggregates = (params, callback) ->
  if @isId(params) or Array.isArray(params)
    params = divisionId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionAggregates', 'must provide
      divisionId or query parameters'

  @loadItems 'divisionAggregate', params, callback
