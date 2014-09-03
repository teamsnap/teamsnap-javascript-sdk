exports.STATUS_NO = 0
exports.STATUS_YES = 1
exports.STATUS_MAYBE = 2
exports.AVAILABILITY_STATUSES =
  no: exports.STATUS_NO
  yes: exports.STATUS_YES
  maybe: exports.STATUS_MAYBE

statuses = {}
for key, value of exports.AVAILABILITY_STATUSES
  statuses[value] = true
  exports.AVAILABILITY_STATUSES[value] = key

exports.loadAvailabilities = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadAvailabilities', 'must provide a teamId
      or query parameters'

  @loadItems 'availability', params, callback


exports.createAvailability = (data) ->
  @createItem data,
    type: 'availability'


exports.saveAvailability = (availability, callback) ->
  unless availability
    throw new TSArgsError 'teamsnap.saveAvailability', "`availability` must be
      provided"
  unless @isItem availability, 'availability'
    throw new TSArgsError 'teamsnap.saveAvailability', "`type` must be
      'availability'"
  unless trackedItemStatus.memberId
    return @reject 'You must choose a member.', 'memberId', callback
  unless trackedItemStatus.eventId
    return @reject 'You must choose an event.', 'eventId', callback
  unless statuses[trackedItemStatus.statusCode]
    return @reject 'You must select a valid status', 'statusCode', callback

  @saveItem availability, callback


exports.deleteAvailability = (availability) ->
  unless availability
    throw new TSArgsError 'teamsnap.deleteAvailability',
      '`availability` must be provided'

  @deleteItem availability
