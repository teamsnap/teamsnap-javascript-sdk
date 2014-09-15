
exports.loadTeamsPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPreferences', 'must provide a
      teamId or query parameters'

  @loadItems 'teamPreferences', params, callback


# Singular version
exports.loadTeamPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPreferences', 'must provide a
      teamId or query parameters'

  @loadItem 'teamPreferences', params, callback


exports.saveTeamPreferences = (teamPreferences, callback) ->
  unless teamPreferences
    throw new TSArgsError 'teamsnap.saveTeamPreferences',
      "`teamPreferences` must be provided"
  unless @isItem teamPreferences, 'teamPreferences'
    throw new TSArgsError 'teamsnap.saveTeamPreferences',
      "`teamPreferences.type` must be 'teamPreferences'"

  @saveItem teamPreferences, callback
