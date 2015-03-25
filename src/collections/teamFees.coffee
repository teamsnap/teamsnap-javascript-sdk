exports.loadTeamFees = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamFees', 'must provide a
      teamId or query parameters'

  @loadItems 'teamFee', params, callback


exports.createTeamFee = (data) ->
  @createItem data,
    type: 'teamFee'


exports.saveTeamFee = (teamFee, callback) ->
  unless teamFee
    throw new TSArgsError 'teamsnap.saveTeamFee', '`teamFee`
      must be provided'
  unless @isItem teamFee, 'teamFee'
    throw new TSArgsError 'teamsnap.saveTeamFee',
      "`teamFee.type` must be 'teamFee'"
  unless teamFee.teamId
    return @reject 'You must choose a team.', 'teamId', callback
  @saveItem teamFee, callback


exports.deleteTeamFee = (teamFee, callback) ->
  unless teamFee
    throw new TSArgsError 'teamsnap.deleteTeamFee',
      '`teamFee` must be provided'

  @deleteItem teamFee, callback
