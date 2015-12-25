
exports.loadMemberPhoneNumbers = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberPhoneNumbers', 'must provide a
      teamId or query parameters'

  @loadItems 'memberPhoneNumber', params, callback


exports.createMemberPhoneNumber = (data) ->
  @createItem data,
    type: 'memberPhoneNumber'


exports.saveMemberPhoneNumber = (memberPhoneNumber, callback) ->
  unless memberPhoneNumber
    throw new TSArgsError 'teamsnap.saveMemberPhoneNumber', '`memberPhoneNumber`
      must be provided'
  unless @isItem memberPhoneNumber, 'memberPhoneNumber'
    throw new TSArgsError 'teamsnap.saveMemberPhoneNumber',
      "`memberPhoneNumber.type` must be 'memberPhoneNumber'"
  unless memberPhoneNumber.memberId
    return @reject 'You must choose a member.', 'memberId', callback

  @saveItem memberPhoneNumber, callback


exports.deleteMemberPhoneNumber = (memberPhoneNumber, callback) ->
  unless memberPhoneNumber
    throw new TSArgsError 'teamsnap.deleteMemberPhoneNumber',
      '`memberPhoneNumber` must be provided'

  @deleteItem memberPhoneNumber, callback
