exports.TRACKING =
  NONE: null
  CHECK: 1
  X: 2

statuses = {}
for key, value of exports.TRACKING
  statuses[value] = true

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
    return @reject 'You must provide a name for the trackedItem.', 'name',
      callback

  @saveItem trackedItem, callback


exports.deleteTrackedItem = (trackedItem, callback) ->
  unless trackedItem
    throw new TSArgsError 'teamsnap.deleteTrackedItem',
      '`trackedItem` must be provided'

  @deleteItem trackedItem, callback


# Tracked Item Statuses
exports.loadTrackedItemStatuses = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTrackedItemStatuses', 'must provide a
      teamId or query parameters'

  @loadItems 'trackedItemStatus', params, callback


exports.saveTrackedItemStatus = (trackedItemStatus, callback) ->
  unless trackedItemStatus
    throw new TSArgsError 'teamsnap.saveTrackedItemStatus',
      "`trackedItemStatus` must be provided"
  unless @isItem trackedItemStatus, 'trackedItemStatus'
    throw new TSArgsError 'teamsnap.saveTrackedItemStatus',
      "`trackedItemStatus.type` must be 'trackedItemStatus'"
  unless trackedItemStatus.trackedItemId
    return @reject 'You must choose a tracked item.', 'trackedItemId', callback
  unless trackedItemStatus.memberId
    return @reject 'You must choose a member.', 'memberId', callback
  unless statuses[trackedItemStatus.statusCode]
    return @reject 'You must select a valid status', 'statusCode', callback

  @saveItem trackedItemStatus, callback
    

exports.trackedItemSort = ->
  (itemA, itemB) =>
    if !@isItem(itemA, 'trackedItem') or !@isItem(itemB, 'trackedItem')
      valueA = itemA.type
      valueB = itemB.type
    else
      valueA = itemA.createdAt
      valueB = itemB.createdAt
    if valueA < valueB then 1
    else if valueA > valueB then -1
    else 0