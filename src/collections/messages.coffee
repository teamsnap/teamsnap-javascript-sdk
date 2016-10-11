exports.loadMessages = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMessages', 'must provide a
      teamId or query parameters'

  @loadItems 'message', params, callback

exports.markMessageAsRead = (params, callback) ->
  if typeof params is 'object'
    params = id: params.id
  else if @isId params
    params = id: params
  else
    throw new TSArgsError 'teamsnap.markMessageAsRead',
      'a message `id` or `message` object must be provided'

  @collections.messages.exec('markMessageAsRead', params)
    .pop().callback callback

exports.bulkDeleteMessages = (messages, callback) ->
  if Array.isArray messages
    if messages.length is 0
      throw new TSArgsError 'teamsnap.bulkDeleteMessages',
        'The array of messages to be deleted is empty.'
    else if @isItem messages[0], 'message'
      messages = id: messages.map (message) -> message.id
    else if @isId messages[0]
      messages = id: messages
    else
      throw new TSArgsError 'teamsnap.bulkDeleteMessages',
        'Must provide an `array` of message `ids` or `message` objects'
  else if typeof messages is 'object' and @isItem messages, 'message'
    messages = id: messages.id
  else if @isId messages
    messages = id: messages
  else
    throw new TSArgsError 'teamsnap.bulkDeleteMessages',
      'Must provide an `array` of message `ids`, an `id` or a `message` object'

  @collections.messages.exec('bulkDelete', messages).callback callback
