exports.teamPaypalPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.teamPaypalPreferences', 'must provide a
      teamId or query parameters'

  @loadItem 'teamPaypalPreferences', params, callback

exports.saveTeamPaypalPreferences = (teamPaypalPreferences, callback) ->
  unless teamPaypalPreferences
    throw new TSArgsError 'teamsnap.saveTeamPaypalPreferences',
      "`teamPaypalPreferences` must be provided"
  unless @isItem teamPaypalPreferences, 'teamPaypalPreferences'
    throw new TSArgsError 'teamsnap.saveTeamPaypalPreferences',
      "`teamPaypalPreferences.type` must be 'teamPaypalPreferences'"

  @saveItem teamPaypalPreferences, callback
  