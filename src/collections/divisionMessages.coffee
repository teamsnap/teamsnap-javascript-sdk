exports.loadDivisionMessages = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionMessages', 'must provide a
      teamId or query parameters'

  @loadItems 'divisionMessage', params, callback
