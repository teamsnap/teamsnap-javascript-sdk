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
  if availability.statusCode isnt null and
      not statuses[availability.statusCode]
    return @reject 'You must select a valid status or null', 'statusCode',
      callback

  @saveItem availability, callback

exports.bulkMarkUnsetAvailabilities = (memberId, statusCode, callback) ->
  unless @isId memberId
    throw new TSArgsError 'teamsnap.bulkMarkUnsetAvailabilities', "must provide
     a `memberId`"
  unless statusCode? and statuses[statusCode]
    return @reject 'You must select a valid status', 'statusCode',
      callback

  params = memberId: memberId, statusCode: statusCode
  @collections.availabilities.exec('bulkMarkUnsetAvailabilities', params)
    .pop().callback callback