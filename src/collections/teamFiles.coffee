exports.loadTeamFiles = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamFiles', 'must provide a teamId
      or query parameters'

  @loadItems 'teamFile', params, callback