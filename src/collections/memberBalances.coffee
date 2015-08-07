exports.loadMemberBalances = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberBalances', 'must provide a
      teamId or query parameters'

  @loadItems 'memberBalance', params, callback