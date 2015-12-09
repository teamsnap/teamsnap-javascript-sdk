exports.loadForumSubscriptions = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadForumSubscriptions', 'must provide
      a teamId or query parameters'

  @loadItems 'forumSubscription', params, callback

exports.createForumSubscription = (data) ->
  @createItem data,
    type: 'forumSubscription'

exports.saveForumSubscription = (forumSubscription, callback) ->
  unless forumSubscription
    throw new TSArgsError 'teamsnap.saveForumSubscription',
    "`forumSubscription` must be provided"
  unless @isItem forumSubscription, 'forumSubscription'
    throw new TSArgsError 'teamsnap.saveForumSubscription', "`type` must
      be 'forumSubscription'"
  unless forumSubscription.forumTopicId
    return @reject 'You must provide a forum topic id.',
      'forumTopicId', callback
  unless forumSubscription.memberId
    return @reject 'You must provide a member id.',
      'memberId', callback

  @saveItem forumSubscription, callback

exports.deleteForumSubscription = (forumSubscription, callback) ->
  unless forumSubscription
    throw new TSArgsError 'teamsnap.deleteForumSubscription',
      '`forumSubscription` must be provided'

  @deleteItem forumSubscription, callback
