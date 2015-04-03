exports.loadDivisionCustomFields = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionCustomFields', 'must provide a teamId or
      query parameters'

  @loadItems 'divisionCustomField', params, callback
