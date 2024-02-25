# Load eventLineups by eventId or query parameters
exports.loadEventLineups = (params, callback) ->
  if @isId params
    params = eventId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadEventLineups', 'must provide a eventId
      or query parameters'

  @loadItems 'eventLineup', params, callback

exports.createEventLineup = (data) ->
  @createItem data,
    type: 'eventLineup'
    isPublished: false

exports.saveEventLineup = (eventLineup, callback) ->
  unless eventLineup
    throw new TSArgsError 'teamsnap.saveEventLineup', "`eventLineup` must
      be provided"
  unless eventLineup.eventId
    return @reject 'You must choose a event.', 'eventId', callback

  @saveItem eventLineup, callback

exports.deleteEventLineup = (eventLineup, callback) ->
  unless eventLineup
    throw new TSArgsError 'teamsnap.deleteEventLineup', "`eventLineup`
      must be provided"

  @deleteItem eventLineup, callback