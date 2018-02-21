exports.loadForecasts = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadForecasts', 'must provide a
      teamId or query parameters'

  @loadItems 'forecast', params, callback
