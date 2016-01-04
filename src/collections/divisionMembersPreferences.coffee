exports.PREFS =
  SCHEDULE_SHOW:
    ALL: 1
    GAMES: 2
    EVENTS: 3

exports.loadDivisionMembersPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionMembersPreferences', 'must
    provide a teamId or query parameters'

  @loadItems 'divisionMemberPreferences', params, callback


# Singular version
exports.loadDivisionMemberPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionMemberPreferences', 'must
    provide a teamId or query parameters'

  @loadItem 'divisionMemberPreferences', params, callback


exports.saveDivisionMemberPreferences = (divisionMemberPreferences, callback) ->
  unless divisionMemberPreferences
    throw new TSArgsError 'teamsnap.saveDivisionMemberPreferences',
      "`divisionMemberPreferences` must be provided"
  unless @isItem divisionMemberPreferences, 'divisionMemberPreferences'
    throw new TSArgsError 'teamsnap.saveDivisionMemberPreferences',
      "`divisionMemberPreferences.type` must be 'divisionMemberPreferences'"

  @saveItem divisionMemberPreferences, callback
