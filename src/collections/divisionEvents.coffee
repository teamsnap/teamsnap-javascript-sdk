exports.loadDivisionEvents = (params, callback) ->
  if @isId params
    params = divisionId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionEvents', 'must provide a
      divisionId or query parameters'

  @loadItems 'divisionEvent', params, callback
