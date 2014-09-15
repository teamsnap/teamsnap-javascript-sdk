exports.AVAILABILITIES =
  NONE: null
  NO: 0
  YES: 1
  MAYBE: 2

statuses = {}
for key, value of exports.AVAILABILITIES
  statuses[value] = true


exports.loadAvailabilities = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadAvailabilities', 'must provide a teamId
      or query parameters'

  @loadItems 'availability', params, callback


exports.saveAvailability = (availability, callback) ->
  unless availability
    throw new TSArgsError 'teamsnap.saveAvailability', "`availability` must be
      provided"
  unless @isItem availability, 'availability'
    throw new TSArgsError 'teamsnap.saveAvailability', "`type` must be
      'availability'"
  if trackedItemStatus.statusCode isnt null and
      not statuses[trackedItemStatus.statusCode]
    return @reject 'You must select a valid status or null', 'statusCode',
      callback

  @saveItem availability, callback
