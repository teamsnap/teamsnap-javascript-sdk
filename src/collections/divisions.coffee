exports.loadDivisions = (params = {}, callback) ->
  if typeof params is 'function'
    callback = params
    params = {}
  if Object.keys(params).length
    @loadItems 'division', params, callback
  else
    @loadMe().then (me) =>
      params.userId = me.id
      @loadItems 'division', params, callback


exports.loadDivision = (divisionId, callback) ->
  unless @isId divisionId
    throw new TSArgsError 'teamsnap.loadDivision', 'divisionId must be provided'
  @loadItem 'division', id: divisionId, callback


exports.createDivision = (data) ->
  @createItem data,
    type: 'division'
    name: ''


exports.saveDivision = (division, callback) ->
  unless division
    throw new TSArgsError 'teamsnap.saveDivision', "`division` must be provided"
  unless @isItem division, 'division'
    throw new TSArgsError 'teamsnap.saveDivision', "`type` must be 'division'"
  unless division.name?.trim()
    return @reject 'You must provide a name for the division.', 'name', callback

  @saveItem division, callback


exports.deleteDivision = (division, callback) ->
  unless division
    throw new TSArgsError 'teamsnap.deleteDivision',
      '`division` must be provided'

  @deleteItem division, callback


exports.loadAncestorDivisions = (divisionId, callback) ->
  unless @isId divisionId
    throw new TSArgsError 'teamsnap.loadAncestorDivisions',
      'divisionId must be provided'
  @collections.divisions.queryItems('ancestors', id: divisionId, callback)


exports.loadDescendantDivisions = (divisionId, callback) ->
  unless @isId divisionId
    throw new TSArgsError 'teamsnap.loadDescendantDivisions',
      'divisionId must be provided'
  @collections.divisions.queryItems('descendants', id: divisionId, callback)


exports.loadChildDivisions = (divisionId, callback) ->
  unless @isId divisionId
    throw new TSArgsError 'teamsnap.loadChildDivisions',
      'divisionId must be provided'
  @collections.divisions.queryItems('children', id: divisionId, callback)
