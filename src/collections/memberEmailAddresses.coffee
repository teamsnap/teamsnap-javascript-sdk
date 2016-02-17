exports.INVITED_STATES = ["new", "new_user", "existing_user"]

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

exports.inviteMemberEmailAddresses = (options, callback) ->
  unless options.memberEmailAddressIds
    throw new TSArgsError 'teamsnap.inviteMemberEmailAddresses',
      'options.memberEmailAddressIds is required.'

  unless options.memberId
    throw new TSArgsError 'teamsnap.inviteMemberEmailAddresses',
      'options.memberId is required.'

  unless options.teamId
    throw new TSArgsError 'teamsnap.inviteMemberEmailAddresses',
      'options.teamId is required.'

  unless options.notifyAsMemberId
    throw new TSArgsError 'teamsnap.inviteMemberEmailAddresses',
      'options.notifyAsMemberId is required.'

  @collections.memberEmailAddresses
    .exec('invite', options).pop().callback callback

exports.saveMemberEmailAddress = (memberEmailAddress, callback) ->
  unless memberEmailAddress
    throw new TSArgsError 'teamsnap.saveMemberEmailAddress',
     '`memberEmailAddress` must be provided'
  unless @isItem memberEmailAddress, 'memberEmailAddress'
    throw new TSArgsError 'teamsnap.saveMemberEmailAddress',
      "`memberEmailAddress.type` must be 'memberEmailAddress'"
  unless memberEmailAddress.memberId
    return @reject 'You must choose a member.', 'memberId', callback

  @saveItem memberEmailAddress, callback


exports.deleteMemberEmailAddress = (memberEmailAddress, callback) ->
  unless memberEmailAddress
    throw new TSArgsError 'teamsnap.deleteMemberEmailAddress',
      '`memberEmailAddress` must be provided'

  @deleteItem memberEmailAddress, callback
