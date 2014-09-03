# Load locations by teamId or query parameters
exports.loadLocations = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadLocations', 'must provide a teamId or
      query parameters'

  @loadItems 'location', params, callback


exports.createLocation = (data) ->
  @createItem data,
    type: 'location'
    name: ''


exports.saveLocation = (location, callback) ->
  unless location
    throw new TSArgsError 'teamsnap.saveLocation', "`location` must be provided"
  unless @isItem location, 'location'
    throw new TSArgsError 'teamsnap.saveLocation', "`location.type` must be
      'location'"
  unless location.teamId
    return @reject 'You must choose a team.', 'teamId', callback
  unless location.name?.trim()
    return @reject 'You must provide a name for the location.', 'name', callback

  @saveItem location, callback


exports.deleteLocation = (location, callback) ->
  unless location
    throw new TSArgsError 'teamsnap.deleteLocation',
      '`location` must be provided'

  @deleteItem location, callback