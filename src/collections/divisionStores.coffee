exports.loadDivisionStore = (params, callback) ->
  if @isId params
    params = divisionId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionStore', 'must provide a divisionId
      or query parameters'

  @loadItem 'divisionStore', params, callback
