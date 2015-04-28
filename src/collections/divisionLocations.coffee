exports.loadDivisionLocations = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionLocations', 'must provide a
      teamId or query parameters'

  @loadItems 'divisionLocation', params, callback
