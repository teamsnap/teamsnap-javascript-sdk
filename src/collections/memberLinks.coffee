
exports.loadMemberLinks = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberLinks', 'must provide a teamId or
      query parameters'

  @loadItems 'memberLink', params, callback


exports.createMemberLink = (data) ->
  @createItem data,
    type: 'memberLink'


exports.saveMemberLink = (memberLink, callback) ->
  unless memberLink
    throw new TSArgsError 'teamsnap.saveMemberLink', '`memberLink`
      must be provided'
  unless @isItem memberLink, 'memberLink'
    throw new TSArgsError 'teamsnap.saveMemberLink',
      "`memberLink.type` must be 'memberLink'"
  unless memberLink.memberId
    return @reject 'You must choose a member.', 'memberId', callback

  @saveItem memberLink, callback


exports.deleteMemberLink = (memberLink, callback) ->
  unless memberLink
    throw new TSArgsError 'teamsnap.deleteMemberLink',
      '`memberLink` must be provided'

  @deleteItem memberLink, callback
