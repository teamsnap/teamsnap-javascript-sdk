# load all the divisions the current user has access to
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

# load a single division
exports.loadDivision = (divisionId, callback) ->
  unless @isId divisionId
    throw new TSArgsError 'teamsnap.loadDivision', 'divisionId must be provided'
  @loadItem 'division', id: divisionId, callback

exports.createDivision = (division) ->
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

exports.ancestorDivisions = (divisionId, callback) ->
  unless @isId divisionId
    throw new TSArgsError 'teamsnap.loadDivision', 'divisionId must be provided'
  @collections.divisions.exec('ancestors', id: divisionId, callback)

exports.descendantDivisions = (divisionId, callback) ->
  unless @isId divisionId
    throw new TSArgsError 'teamsnap.loadDivision', 'divisionId must be provided'
  @collections.divisions.exec('descendants', id: divisionId, callback)

exports.childrenDivisions = (divisionId, callback) ->
  unless @isId divisionId
    throw new TSArgsError 'teamsnap.loadDivision', 'divisionId must be provided'
  @collections.divisions.exec('children', id: divisionId, callback)
