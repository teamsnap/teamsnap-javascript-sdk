# exports.loadSports = (params, callback) ->
#   unless params and typeof params is 'object'
#     throw new TSArgsError 'teamsnap.loadSports', 'must provide query parameters'

#   @loadItems 'sport', params, callback


exports.loadSport = (teamId, callback) ->
  unless @isId teamId
    throw new TSArgsError 'teamsnap.loadSport', 'must provide a teamId'
  params = teamId: teamId
  @loadItem 'sport', params, callback