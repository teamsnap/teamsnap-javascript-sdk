exports.loadRefreshments = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadRefreshments', 'must provide a
      teamId or query parameters'

  @loadItems 'refreshment', params, callback


exports.createRefreshment = (data) ->
  @createItem data,
    type: 'refreshment'
    description: ''


exports.saveRefreshment = (refreshment, callback) ->
  unless refreshment
    throw new TSArgsError 'teamsnap.saveRefreshment',
      "`refreshment` must be provided"
  unless @isItem refreshment, 'refreshment'
    throw new TSArgsError 'teamsnap.saveRefreshment',
      "`refreshment.type` must be 'refreshment'"
  unless refreshment.memberId
    return @reject 'You must choose a member.', 'memberId', callback
  unless refreshment.eventId
    return @reject 'You must choose an event.', 'eventId', callback
  unless refreshment.description?.trim()
    return @reject 'You must provide a description for the refreshment.',
      'name', callback

  @saveItem refreshment, callback


exports.deleteRefreshment = (refreshment, callback) ->
  unless refreshment
    throw new TSArgsError 'teamsnap.deleteRefreshment',
      '`refreshment` must be provided'

  @deleteItem refreshment, callback


# Sorts refreshments by their member, must have refreshment.member set to
# correctly sort
exports.refreshmentSort = (reverse) ->
  (itemA, itemB) =>
    if !@isItem(itemA, 'refreshment') or !@isItem(itemB, 'refreshment')
      valueA = itemA.type
      valueB = itemB.type
    else
      valueA = @memberName(itemA.member, reverse).toLowerCase()
      valueB = @memberName(itemB.member, reverse).toLowerCase()
    if valueA > valueB then 1
    else if valueA < valueB then -1
    else 0