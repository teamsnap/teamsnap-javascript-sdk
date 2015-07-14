exports.loadStatisticData = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadStatisticData', 'must provide a teamId
    or query parameters'

  @loadItems 'statisticDatum', params, callback


exports.createStatisticDatum = (data) ->
  @createItem data,
    type: 'statisticDatum'


exports.saveStatisticDatum = (statisticDatum, callback) ->
  unless statisticDatum
    throw new TSArgsError 'teamsnap.saveStatisticDatum', '`statisticDatum`
      must be provided'
  unless @isItem statisticDatum, 'statisticDatum'
    throw new TSArgsError 'teamsnap.saveStatisticDatum',
      "`statisticDatum.type` must be 'statisticDatum'"
  unless statisticDatum.eventId
    return @reject 'You must specify an event.', 'eventId', callback
  unless statisticDatum.statisticId
    return @reject 'You must specify a statistic.', 'statisticId', callback
  unless statisticDatum.teamId
    return @reject 'You must choose a team.', 'teamId', callback

  @saveItem statisticDatum, callback


exports.deleteStatisticDatum = (statisticDatum, callback) ->
  unless statisticDatum
    throw new TSArgsError 'teamsnap.deleteStatisticDatum',
      '`statisticDatum` must be provided'

  @deleteItem statisticDatum, callback


exports.bulkSaveStatisticData = (templates, callback) ->
  unless templates
    throw new TSArgsError 'teamsnap.bulkSaveStatisticData',
      "`templates` must be provided"

  params = templates: templates
  @collections.statisticData.exec('bulkUpdateStatisticData', params)
  .callback callback


exports.bulkDeleteStatisticData = (member, event, callback) ->
  unless member
    throw new TSArgsError 'teamsnap.bulkDeleteStatisticData',
      "`member` must be provided"
  unless @isItem member, 'member'
    throw new TSArgsError 'teamsnap.bulkDeleteStatisticData',
      "`member.type` must be 'member'"
  unless event
    throw new TSArgsError 'teamsnap.bulkDeleteStatisticData',
      "`event` must be provided"
  unless @isItem event, 'event'
    throw new TSArgsError 'teamsnap.bulkDeleteStatisticData',
      "`event.type` must be 'event'"
  
  params =
    memberId: member.id
    eventId: event.id
  @collections.statisticData.exec('bulkDeleteStatisticData', params)
  .callback callback