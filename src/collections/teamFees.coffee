exports.loadTeamFees = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamFees', 'must provide a
      teamId or query parameters'

  @loadItems 'teamFee', params, callback