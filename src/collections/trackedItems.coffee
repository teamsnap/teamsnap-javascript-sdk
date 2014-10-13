# Tracked Items
exports.loadTrackedItems = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTrackedItems', 'must provide a teamId or
      query parameters'

  @loadItems 'trackedItem', params, callback


exports.createTrackedItem = (data) ->
  @createItem data,
    type: 'trackedItem'
    name: ''


exports.saveTrackedItem = (trackedItem, callback) ->
  unless trackedItem
    throw new TSArgsError 'teamsnap.saveTrackedItem',
      "`trackedItem` must be provided"
  unless @isItem trackedItem, 'trackedItem'
    throw new TSArgsError 'teamsnap.saveTrackedItem',
      "`trackedItem.type` must be 'trackedItem'"
  unless trackedItem.teamId
    return @reject 'You must choose a team.', 'teamId', callback
  unless trackedItem.name?.trim()
    return @reject 'You must provide a name for the tracked item.', 'name',
      callback

  @saveItem trackedItem, callback


exports.deleteTrackedItem = (trackedItem, callback) ->
  unless trackedItem
    throw new TSArgsError 'teamsnap.deleteTrackedItem',
      '`trackedItem` must be provided'

  @deleteItem trackedItem, callback
