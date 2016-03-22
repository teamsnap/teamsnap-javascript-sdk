exports.loadMessageData = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMessageData', 'must provide a
    teamId or query parameters'

  @loadItems 'messageDatum', params, callback