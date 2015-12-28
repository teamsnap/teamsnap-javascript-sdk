exports.loadSentMessages = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadSentMessages', 'must provide a
      teamId or query parameters'

  @loadItems 'sentMessage', params, callback