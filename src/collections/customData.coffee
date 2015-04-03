
exports.loadCustomData = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadCustomData', 'must provide a teamId or
      query parameters'

  @loadItems 'customDatum', params, callback

exports.createCustomDatum = (data, field) ->
  @createItem data,
    type: 'customDatum'
    customFieldId: field.id
    kind: field.kind
    name: field.name
    isPrivate: false
    value: null

exports.saveCustomDatum = (customDatum, callback) ->
  unless customDatum
    throw new TSArgsError 'teamsnap.saveCustomField', '`customDatum`
      must be provided'
  unless @isItem customDatum, 'customDatum'
    throw new TSArgsError 'teamsnap.saveCustomField',
      "`customDatum.type` must be 'customDatum'"

  @saveItem customDatum, callback
