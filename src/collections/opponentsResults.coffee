exports.loadOpponentsResults = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadOpponentsResults', 'must provide query
     parameters'
  @loadItems 'opponentResults', params, callback


exports.loadOpponentResults = (opponentId, callback) ->
  unless @isId opponentId
    throw new TSArgsError 'teamsnap.loadOpponentResults',
      'must provide an opponentId'
  params = id: opponentId
  @loadItem 'opponentResults', params, callback
