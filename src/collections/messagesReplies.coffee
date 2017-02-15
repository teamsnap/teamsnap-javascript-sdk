exports.loadMessagesReplies = (params, callback) ->
  if @isId params
    params = messageId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMessagesReplies', 'must provide a
      messageId or query parameters'

  @loadItems 'messageReplies', params, callback
