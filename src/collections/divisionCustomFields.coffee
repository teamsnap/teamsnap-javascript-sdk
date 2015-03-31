
exports.loadDivisionCustomFields = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionCustomFields', 'must provide a teamId or
      query parameters'

  @loadItems 'divisionCustomField', params, callback


exports.createDivisionCustomField = (data) ->
  @createItem data,
    type: 'divisionCustomField'


exports.saveDivisionCustomField = (divisionCustomField, callback) ->
  unless divisionCustomField
    throw new TSArgsError 'teamsnap.saveDivisionCustomField', '`divisionCustomField`
      must be provided'
  unless @isItem divisionCustomField, 'divisionCustomField'
    throw new TSArgsError 'teamsnap.saveCustomField',
      "`divisionCustomField.type` must be 'divisionCustomField'"
  unless divisionCustomField.teamId
    return @reject 'You must choose a team.', 'teamId', callback
  unless divisionCustomField.name
    return @reject 'You must enter a name.', 'name', callback
  unless divisionCustomField.kind
    return @reject 'You must choose a type.', 'kind', callback

  @saveItem divisionCustomField, callback


exports.deleteDivisionCustomField = (divisionCustomField, callback) ->
  unless divisionCustomField
    throw new TSArgsError 'teamsnap.deleteDivisionCustomField',
      '`divisionCustomField` must be provided'

  @deleteItem divisionCustomField, callback
