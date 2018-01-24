
exports.loadTeamNames = (params, callback) ->
  if @isId params
    params = id: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamNames', 'must provide a
      teamId or query parameters'

  @loadItems 'teamName', params, callback

