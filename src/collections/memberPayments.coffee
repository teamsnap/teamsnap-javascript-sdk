exports.loadMemberPayments = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberPayments', 'must provide a
      teamId or query parameters'

  @loadItems 'memberPayment', params, callback


exports.saveMemberPayment = (memberPayment, callback) ->
  unless memberPayment
    throw new TSArgsError 'teamsnap.saveMemberPayment', '`memberPayment`
      must be provided'
  unless @isItem memberPayment, 'memberPayment'
    throw new TSArgsError 'teamsnap.saveMemberPayment',
      "`memberPayment.type` must be 'memberPayment'"
  unless memberPayment.memberId
    return @reject 'You must choose a member.', 'memberId', callback

  @saveItem memberPayment, callback
