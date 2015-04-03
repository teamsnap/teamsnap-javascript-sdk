exports.loadDivisionCustomData = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDivisionCustomData', 'must provide a teamId or
      query parameters'

  @loadItems 'divisionCustomDatum', params, callback

exports.createDivisionCustomDatum = (data, field) ->
  @createItem data,
    type: 'divisionCustomDatum'
    divisionCustomFieldId: field.id
    kind: field.kind
    name: field.name
    isPrivate: false
    value: null

exports.saveDivisionCustomDatum = (divisionCustomDatum, callback) ->
  unless divisionCustomDatum
    throw new TSArgsError 'teamsnap.saveDivisionCustomDatum', '`divisionCustomDatum`
      must be provided'
  unless @isItem divisionCustomDatum, 'divisionCustomDatum'
    throw new TSArgsError 'teamsnap.saveDivisionCustomDatum',
      "`divisionCustomDatum.type` must be 'divisionCustomDatum'"

  @saveItem divisionCustomDatum, callback
