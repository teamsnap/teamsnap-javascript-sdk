exports.loadLeagueCustomData = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadLeagueCustomData', 'must provide a teamId or
      query parameters'

  @loadItems 'leagueCustomDatum', params, callback

exports.createLeagueCustomDatum = (data, field) ->
  @createItem data,
    type: 'leagueCustomDatum'
    leagueCustomFieldId: field.id
    kind: field.kind
    name: field.name
    isPrivate: false
    value: null

exports.saveLeagueCustomDatum = (leagueCustomDatum, callback) ->
  unless leagueCustomDatum
    throw new TSArgsError 'teamsnap.saveLeagueCustomDatum', '`leagueCustomDatum`
      must be provided'
  unless @isItem leagueCustomDatum, 'leagueCustomDatum'
    throw new TSArgsError 'teamsnap.saveLeagueCustomDatum',
      "`leagueCustomDatum.type` must be 'leagueCustomDatum'"

  @saveItem leagueCustomDatum, callback
