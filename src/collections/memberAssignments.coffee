exports.loadMemberAssignments = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberAssignments', 'must provide a
      teamId or query parameters'

  @loadItems 'memberAssignment', params, callback

exports.createMemberAssignment = (data) ->
  @createItem data,
    type: 'memberAssignment'

exports.saveMemberAssignment = (memberAssignment, callback) ->
  unless memberAssignment
    throw new TSArgsError 'teamsnap.saveMemberAssignment',
      "`memberAssignment` must be provided"
  unless @isItem memberAssignment, 'memberAssignment'
    throw new TSArgsError 'teamsnap.saveMemberAssignment',
      "`memberAssignment.type` must be 'memberAssignment'"

  @saveItem memberAssignment, callback

exports.removeMemberAssignment = (memberAssignment, callback) ->
  unless memberAssignment
    throw new TSArgsError 'teamsnap.removeMemberAssignment',
      '`memberAssignment` must be provided'

  @deleteItem memberAssignment, callback
