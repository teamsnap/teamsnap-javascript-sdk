exports.loadForumPosts = (params, callback) ->
  if @isId params
    params = id: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadForumPosts', 'must provide an id or
      query parameters'

  @loadItems 'forumPost', params, callback

exports.createForumPost = (data) ->
  @createItem data,
    type: 'forumPost'

exports.saveForumPost = (forumPost, callback) ->
  unless forumPost
    throw new TSArgsError 'teamsnap.saveForumPost', "`forumPost` must
      be provided"
  unless @isItem forumPost, 'forumPost'
    throw new TSArgsError 'teamsnap.saveForumPost', "`type` must
      be 'forumPost'"
  unless forumPost.forumTopicId
    return @reject 'You must provide a forum topic id.',
      'forumTopicId', callback
  unless forumPost.memberId
    return @reject 'You must provide a member id.',
      'memberId', callback
  unless forumPost.message?.trim()
    return @reject 'You must provide a message for the forum post.',
      'message', callback

  @saveItem forumPost, callback

exports.deleteForumPost = (forumPost, callback) ->
  unless forumPost
    throw new TSArgsError 'teamsnap.deleteForumPost', '`forumPost` must
      be provided'

  @deleteItem forumPost, callback
