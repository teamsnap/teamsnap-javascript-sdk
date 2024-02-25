# EventLineupEntries API endpoint has some irregularities
# loadEventLineupEntry and bulkUpdateEventLineupEntries
# intentionally omitted
exports.createEventLineupEntry = (data) ->
  @createItem data,
    type: 'eventLineupEntry'

exports.saveEventLineupEntry = (eventLineupEntry, callback) ->
  unless eventLineupEntry
    throw new TSArgsError 'teamsnap.saveEventLineupEntry',
      "`eventLineupEntry` must be provided"
  unless @isItem eventLineupEntry, 'eventLineupEntry'
    throw new TSArgsError 'teamsnap.saveEventLineupEntry',
      "`type` must be 'eventLineupEntry'"
  unless eventLineupEntry.eventLineupId
    return @reject 'You must choose a eventLineup', 'eventLineup', callback
  unless eventLineupEntry.memberId
    return @reject 'You must choose a member', 'member', callback
  
  @saveItem eventLineupEntry, callback

exports.deleteEventLineupEntry = (eventLineupEntry, callback) ->
  unless eventLineupEntry
    throw new TSArgsError 'teamsnap.saveEventLineupEntry', 
      "`eventLineupEntry` must be provided"
  
  @deleteItem eventLineupEntry, callback
