exports.loadReceivedMessages = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadReceivedMessages', 'must provide a
      teamId or query parameters'

  @loadItems 'receivedMessage', params, callback

exports.markReceivedMessageAsRead = (id, callback) ->
  params = id: id
  @collections.receivedMessages.exec('markReceivedMessageAsRead', params)
    .pop().callback callback