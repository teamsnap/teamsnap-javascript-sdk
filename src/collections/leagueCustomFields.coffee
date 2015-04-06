exports.loadLeagueCustomFields = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadLeagueCustomFields', 'must provide a teamId or
      query parameters'

  @loadItems 'leagueCustomField', params, callback
