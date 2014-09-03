exports.loadTeamPublicSites = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPublicSites', 'must provide a teamId
      or query parameters'

  @loadItems 'teamPublicSite', params, callback


exports.loadTeamPublicSite = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPublicSite', 'must provide a teamId
      or query parameters'

  @loadItem 'teamPublicSite', params, callback


exports.saveTeamPublicSite = (teamPublicSite, callback) ->
  unless teamPublicSite
    throw new TSArgsError 'teamsnap.saveTeamPublicSite',
      "`teamPublicSite` must be provided"
  unless @isItem teamPublicSite, 'teamPublicSite'
    throw new TSArgsError 'teamsnap.saveTeamPublicSite',
      "`teamPublicSite.type` must be 'teamPublicSite'"

  @saveItem teamPublicSite, callback