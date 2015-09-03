exports.loadTeamMediumComments = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamMediumComments', 'must provide a
    teamId or query parameters'

  @loadItems 'teamMediumComment', params, callback


exports.createTeamMediumComment = (data) ->
  @createItem data,
    type: 'teamMediumComment'


exports.saveTeamMediumComment = (teamMediumComment, callback) ->
  unless teamMediumComment
    throw new TSArgsError 'teamsnap.saveTeamMediaComment', '`teamMediumComment`
      must be provided'
  unless @isItem teamMediumComment, 'teamMediumComment'
    throw new TSArgsError 'teamsnap.saveTeamMediaComment',
      "`teamMediumComment.type` must be 'teamMediumComment'"

  @saveItem teamMediumComment, callback
