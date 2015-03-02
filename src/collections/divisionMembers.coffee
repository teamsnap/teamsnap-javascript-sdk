exports.loadDivisionMembers = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionMembers', 'must provide a
      teamId or query parameters'

  @loadItems 'divisionMember', params, callback
