# Loads forecast information for a team.
# NOTE: This feature is not yet supported publicly as it requires
# additional third-party integration.
exports.loadForecast = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadForecast', 'must provide a teamId'

  @collections.root.queryItems 'forecast', params, callback
