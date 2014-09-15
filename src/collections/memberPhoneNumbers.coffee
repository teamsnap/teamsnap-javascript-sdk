
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


exports.saveMemberPhoneNumber = (phoneNumber, callback) ->
  unless phoneNumber
    throw new TSArgsError 'teamsnap.saveMemberPhoneNumber', '`phoneNumber`
      must be provided'
  unless @isItem phoneNumber, 'memberPhoneNumber'
    throw new TSArgsError 'teamsnap.saveMemberPhoneNumber',
      "`phoneNumber.type` must be 'memberPhoneNumber'"
  unless phoneNumber.memberId
    return @reject 'You must choose a member.', 'memberId', callback

  @saveItem phoneNumber, callback


exports.deleteMemberPhoneNumber = (phoneNumber, callback) ->
  unless phoneNumber
    throw new TSArgsError 'teamsnap.deleteMemberPhoneNumber',
      '`phoneNumber` must be provided'

  @deleteItem phoneNumber, callback
