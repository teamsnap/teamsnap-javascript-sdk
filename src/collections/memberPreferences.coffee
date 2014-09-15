
exports.loadMembersPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMembersPreferences', 'must provide a
      teamId or query parameters'

  @loadItems 'memberPreferences', params, callback


# Singular version
exports.loadMemberPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberPreferences', 'must provide a
      teamId or query parameters'

  @loadItem 'memberPreferences', params, callback


exports.saveMemberPreferences = (memberPreferences, callback) ->
  unless memberPreferences
    throw new TSArgsError 'teamsnap.saveMemberPreferences',
      "`memberPreferences` must be provided"
  unless @isItem memberPreferences, 'memberPreferences'
    throw new TSArgsError 'teamsnap.saveMemberPreferences',
      "`memberPreferences.type` must be 'memberPreferences'"

  @saveItem memberPreferences, callback


exports.saveTeamPreferences = (teamPreferences, callback) ->
  unless teamPreferences
    throw new TSArgsError 'teamsnap.saveTeamPreferences',
      "`teamPreferences` must be provided"
  unless @isItem teamPreferences, 'teamPreferences'
    throw new TSArgsError 'teamsnap.saveTeamPreferences',
      "`teamPreferences.type` must be 'teamPreferences'"

  @saveItem teamPreferences, callback
