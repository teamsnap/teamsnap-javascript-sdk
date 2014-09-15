exports.EVENTS =
  NONE: 'none'
  FUTURE: 'future'
  ALL: 'all'

includes = {}
includes[value] = true for key, value of exports.EVENTS


# Load events by teamId or query parameters
exports.loadEvents = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadEvents', 'must provide a teamId or
      query parameters'

  @loadItems 'event', params, callback


exports.createEvent = (data) ->
  @createItem data,
    type: 'event'
    isGame: false
    tracksAvailability: true


exports.saveEvent = (event, callback) ->
  unless event
    throw new TSArgsError 'teamsnap.saveEvent', "`event` must be provided"
  unless @isItem event, 'event'
    throw new TSArgsError 'teamsnap.saveEvent', "`event.type` must be 'event'"
  unless event.isGame or event.name?.trim()
    return @reject 'You must provide a name.', 'name', callback
  unless event.teamId
    return @reject 'You must choose a team.', 'teamId', callback
  unless event.locationId
    return @reject 'You must choose a location.', 'locationId', callback
  if event.isGame and not event.opponentId
    return @reject 'You must choose an opponent.', 'opponentId', callback
  if isNaN event.startDate?.getTime()
    return @reject 'You must provide a valid start date.', 'startDate', callback

  @saveItem event, callback


exports.deleteEvent = (event, include, callback) ->
  unless event
    throw new TSArgsError 'teamsnap.deleteEvent', '`event` must be provided'
  
  if typeof include is 'function'
    callback = include
    include = null

  if not include and event.repeatingUuid
    include = @EVENTS.NONE

  if include
    unless includes[include]
      throw new TSArgsError 'teamsnap.deleteEvent', "`include` must be one of
        #{Object.keys(includes).join(', ')}"
    params = repeatingInclude: include

  @deleteItem event, params, callback


# Returns a sorting function for the default event sort
exports.getEventSort = ->
  (itemA, itemB) =>
    if !@isItem(itemA, 'event') or !@isItem(itemB, 'event')
      valueA = itemA.type
      valueB = itemB.type
    else
      valueA = itemA.startDate
      valueB = itemB.startDate
    if valueA > valueB then 1
    else if valueA < valueB then -1
    else 0
