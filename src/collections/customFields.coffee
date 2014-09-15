
exports.loadCustomFields = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadCustomFields', 'must provide a teamId or
      query parameters'

  @loadItems 'customField', params, callback


exports.createCustomField = (data) ->
  @createItem data,
    type: 'customField'


exports.saveCustomField = (customField, callback) ->
  unless customField
    throw new TSArgsError 'teamsnap.saveCustomField', '`customField`
      must be provided'
  unless @isItem customField, 'customField'
    throw new TSArgsError 'teamsnap.saveCustomField',
      "`customField.type` must be 'customField'"
  unless customField.teamId
    return @reject 'You must choose a team.', 'teamId', callback
  unless customField.name
    return @reject 'You must enter a name.', 'name', callback
  unless customField.kind
    return @reject 'You must choose a type.', 'kind', callback

  @saveItem customField, callback


exports.deleteCustomField = (customField, callback) ->
  unless customField
    throw new TSArgsError 'teamsnap.deleteCustomField',
      '`customField` must be provided'

  @deleteItem customField, callback
