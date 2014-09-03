promises = require '../promises'

exports.loadMembersPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberPreferences', 'must provide a
      teamId or query parameters'

  @loadItems 'memberPreferences', params, callback


exports.loadTeamsPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPreferences', 'must provide a
      teamId or query parameters'

  @loadItems 'teamPreferences', params, callback


exports.loadMemberPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberPreferences', 'must provide a
      teamId or query parameters'

  @loadItem 'memberPreferences', params, callback


exports.loadTeamPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPreferences', 'must provide a
      teamId or query parameters'

  @loadItem 'teamPreferences', params, callback


exports.loadPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadPreferences', 'must provide a
      teamId or query parameters'

  promises.when(
    exports.loadMemberPreferences(params)
    exports.loadTeamPreferences(params)
  ).callback callback


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


exports.savePreferences = (memberPreferences, teamPreferences, callback) ->
  unless memberPreferences and teamPreferences
    throw new TSArgsError 'teamsnap.saveTeamPreferences',
      "`memberPreferences` and `teamPreferences` must be provided"
  unless @isItem memberPreferences, 'memberPreferences'
    throw new TSArgsError 'teamsnap.saveTeamPreferences',
      "`memberPreferences.type` must be 'memberPreferences'"
  unless @isItem teamPreferences, 'teamPreferences'
    throw new TSArgsError 'teamsnap.saveTeamPreferences',
      "`teamPreferences.type` must be 'teamPreferences'"

  promises.when(
    @saveItem memberPreferences
    @saveItem teamPreferences
  ).callback callback