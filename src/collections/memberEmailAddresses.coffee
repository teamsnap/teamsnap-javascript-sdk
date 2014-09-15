
exports.loadMemberEmailAddresses = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberEmailAddresses', 'must provide a
      teamId or query parameters'

  @loadItems 'memberEmailAddress', params, callback


exports.createMemberEmailAddress = (data) ->
  @createItem data,
    type: 'memberEmailAddress'
    receivesTeamEmails: true


exports.saveMemberEmailAddress = (emailAddress, callback) ->
  unless emailAddress
    throw new TSArgsError 'teamsnap.saveMemberEmailAddress', '`emailAddress`
      must be provided'
  unless @isItem emailAddress, 'memberEmailAddress'
    throw new TSArgsError 'teamsnap.saveMemberEmailAddress',
      "`emailAddress.type` must be 'memberEmailAddress'"
  unless emailAddress.memberId
    return @reject 'You must choose a member.', 'memberId', callback

  @saveItem emailAddress, callback


exports.deleteMemberEmailAddress = (emailAddress, callback) ->
  unless emailAddress
    throw new TSArgsError 'teamsnap.deleteMemberEmailAddress',
      '`emailAddress` must be provided'

  @deleteItem emailAddress, callback
