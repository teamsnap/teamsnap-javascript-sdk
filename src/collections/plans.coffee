exports.loadPlans = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadPlans', 'must provide query parameters'

  @loadItems 'plan', params, callback


exports.loadPlan = (teamId, callback) ->
  unless @isId teamId
    throw new TSArgsError 'teamsnap.loadPlan', 'must provide a teamId'
  params = teamId: teamId
  @loadItem 'plan', params, callback