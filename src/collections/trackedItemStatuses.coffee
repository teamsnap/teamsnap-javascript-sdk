exports.TRACKING =
  NONE: null
  CHECK: 1
  X: 2

statuses = {}
for key, value of exports.TRACKING
  statuses[value] = true

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