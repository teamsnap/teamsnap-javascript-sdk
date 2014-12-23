exports.loadTeamsResults = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamsResults', 'must provide query
     parameters'

  @loadItems 'teamResults', params, callback


exports.loadTeamResults = (teamId, callback) ->
  unless @isId teamId
    throw new TSArgsError 'teamsnap.loadTeamResults', 'must provide a teamId'
  params = teamId: teamId
  @loadItem 'teamResults', params, callback
