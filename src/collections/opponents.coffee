# Load opponents by teamId or query parameters
exports.loadOpponents = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadOpponents', 'must provide a teamId or
      query parameters'

  @loadItems 'opponent', params, callback


exports.createOpponent = (data) ->
  @createItem data,
    type: 'opponent'
    name: ''


exports.saveOpponent = (opponent, callback) ->
  unless opponent
    throw new TSArgsError 'teamsnap.saveOpponent', "`opponent` must be provided"
  unless @isItem opponent, 'opponent'
    throw new TSArgsError 'teamsnap.saveOpponent', "`opponent.type` must be
      'opponent'"
  unless opponent.teamId
    return @reject 'You must choose a team.', 'teamId', callback
  unless opponent.name?.trim()
    return @reject 'You must provide a name for the opponent.', 'name', callback

  @saveItem opponent, callback


exports.deleteOpponent = (opponent, callback) ->
  unless opponent
    throw new TSArgsError 'teamsnap.deleteOpponent',
      '`opponent` must be provided'

  @deleteItem opponent, callback