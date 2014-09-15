# Load members by teamId or query parameters
exports.loadMembers = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMembers', 'must provide a teamId or
      query parameters'

  @loadItems 'member', params, callback


exports.createMember = (data) ->
  @createItem data,
    type: 'member'


exports.saveMember = (member, callback) ->
  unless member
    throw new TSArgsError 'teamsnap.saveMember', "`member` must be provided"
  unless @isItem member, 'member'
    throw new TSArgsError 'teamsnap.saveMember', "`type` must be 'member'"
  unless member.teamId
    return @reject 'You must choose a team.', 'teamId', callback
  unless member.firstName?.trim()
    return @reject 'You must provide a firstName for the member.', 'name',
    callback

  @saveItem member, callback


exports.deleteMember = (member, callback) ->
  unless member
    throw new TSArgsError 'teamsnap.deleteMember', '`member` must be provided'

  @deleteItem member, callback


# Member photo
exports.deleteMemberPhoto = (memberId) ->
  unless memberId
    throw new TSArgsError 'teamsnap.deleteMemberPhoto', "`memberId` must be
      provided"
  if @isItem memberId, 'member'
    memberId = memberId.id
  unless @isId memberId
    throw new TSArgsError 'teamsnap.deleteMemberPhoto', "`memberId` must be
      a valid id"

  params = memberId: memberId
  @collections.members.exec('removeOriginalPhoto', params)
    .pop().callback callback


exports.deleteMemberThumbnail = (memberId) ->
  unless memberId
    throw new TSArgsError 'teamsnap.deleteThumbnail', "`memberId` must be
      provided"
  if @isItem memberId, 'member'
    memberId = memberId.id
  unless @isId memberId
    throw new TSArgsError 'teamsnap.deleteThumbnail', "`memberId` must be
      a valid id"

  params = memberId: memberId
  @collections.members.exec('removeThumbnailPhoto', params)
    .pop().callback callback


exports.generateThumbnail = (memberId, x, y, width, height) ->
  unless member? and x? and y? and width? and height?
    throw new TSArgsError 'teamsnap.generateThumbnail', "`memberId`, `x`, `y`,
      `width`, and `height` are all required"
  if @isItem memberId, 'member'
    memberId = memberId.id
  unless @isId memberId
    throw new TSArgsError 'teamsnap.generateThumbnail', "`memberId` must be
      a valid id"

  params =
    memberId: member.id
    cropX: x
    cropY: y
    cropWidth: width
    cropHeight: height
  @collections.members.exec('generateThumbnailPhoto', params)
    .pop().callback callback


# Helper to output a member's name, forward or reverse (reverse will use comma)
exports.memberName = (member, reverse) ->
  return '' unless member
  if reverse and member.firstName and member.lastName
    return member.lastName + ', ' + member.firstName
  [ member.firstName or '', member.lastName or '' ].join(' ').trim()


# Returns a sorting function to sort members by firstName, lastName (or reverse)
exports.getMemberSort = (reverse) ->
  (itemA, itemB) =>
    if !@isItem(itemA, 'member') or !@isItem(itemB, 'member')
      valueA = itemA.type
      valueB = itemB.type
    else
      valueA = @memberName(itemA, reverse).toLowerCase()
      valueB = @memberName(itemB, reverse).toLowerCase()
    if valueA > valueB then 1
    else if valueA < valueB then -1
    else 0


# Helper for determining if a member has general write permissions to the team
exports.canEditTeam = (member, team) ->
  return false unless member and team
  (member.isManager or member.isOwner) and
  (not team.isArchivedSeason or member.isOwner)


# Helper for determining if a member has specific write permissions for an item
exports.canEditItem = (member, team, item) ->
  return false unless member and team and @isItem item
  return false if item.readOnly
  return true if teamsnap.canEditTeam member, team
  return false if team.isArchivedSeason
  if @isItem item, 'member'
    item.id is member.id
  else
    item.memberId is member.id
