exports.loadDivisionMessageData = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionMessageData', 'must provide a
    teamId or query parameters'

  @loadItems 'divisionMessageDatum', params, callback