exports.loadDivisionsPreferences = (params, callback) ->
  if @isId params
    params = divisionId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionsPreferences', 'must
    provide a divisionId or query parameters'

  @loadItems 'divisionPreferences', params, callback


# Singular version
exports.loadDivisionPreferences = (params, callback) ->
  if @isId params
    params = divisionId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionPreferences', 'must
    provide a divisionId or query parameters'

  @loadItem 'divisionPreferences', params, callback


exports.saveDivisionPreferences = (divisionPreferences, callback) ->
  unless divisionPreferences
    throw new TSArgsError 'teamsnap.saveDivisionPreferences',
      "`divisionPreferences` must be provided"
  unless @isItem divisionPreferences, 'divisionPreferences'
    throw new TSArgsError 'teamsnap.saveDivisionPreferences',
      "`divisionPreferences.type` must be 'divisionPreferences'"

  @saveItem divisionPreferences, callback
