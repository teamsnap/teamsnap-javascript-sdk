exports.loadMemberPayments = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberPayments', 'must provide a
      teamId or query parameters'

  @loadItem 'memberPayment', params, callback