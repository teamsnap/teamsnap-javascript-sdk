exports.loadTeamStores = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamStores', 'must provide a teamId
      or query parameters'

  @loadItems 'teamStore', params, callback
