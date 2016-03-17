exports.loadForumTopics = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadForumTopics', 'must provide a teamId or
      query parameters'

  @loadItems 'forumTopic', params, callback

exports.createForumTopic = (data) ->
  @createItem data,
    type: 'forumTopic'

exports.saveForumTopic = (forumTopic, callback) ->
  unless forumTopic
    throw new TSArgsError 'teamsnap.saveForumTopic', "`forumTopic` must
      be provided"
  unless @isItem forumTopic, 'forumTopic'
    throw new TSArgsError 'teamsnap.saveForumTopic', "`type` must be
      'forumTopic'"
  unless forumTopic.teamId
    return @reject 'You must choose a team.', 'teamId', callback
  unless forumTopic.title?.trim()
    return @reject 'You must provide a title for the forum topic.', 'title',
      callback

  @saveItem forumTopic, callback

exports.deleteForumTopic = (forumTopic, callback) ->
  unless forumTopic
    throw new TSArgsError 'teamsnap.deleteForumTopic', '`forumTopic` must
      be provided'

  @deleteItem forumTopic, callback

exports.getForumTopicPostsSort = ->
  (itemA, itemB) ->
    valueA = new Date(itemA.forumPosts.last().createdAt)
    valueB = new Date(itemB.forumPosts.last().createdAt)
    if valueA < valueB
      -1
    else if valueA is valueB
      0
    else
      1
