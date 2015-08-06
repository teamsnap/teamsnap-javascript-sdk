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
    return @reject 'You must provide a first name for the member.', 'name',
    callback

  @saveItem member, callback


exports.deleteMember = (member, callback) ->
  unless member
    throw new TSArgsError 'teamsnap.deleteMember', '`member` must be provided'

  @deleteItem member, callback


# Member photo
exports.uploadMemberPhoto = (memberId, file, callback) ->
  if @isItem memberId, 'member'
    memberId = memberId.id
  if typeof FormData is 'undefined'
    @reject 'Your browser does not support the new file upload APIs.', 'file',
      callback
  unless @isId memberId
    throw new TSArgsError 'teamsnap.deleteMemberPhoto', "`memberId` must be
      a valid id"
  unless file instanceof File
    throw new TSArgsError 'teamsnap.uploadMemberFile', 'must include
      `file` as type File'

  params = memberId: memberId, file: file
  @collections.members.exec('uploadMemberPhoto', params)
    .pop().callback callback


exports.removeMemberPhoto = (memberId, callback) ->
  if @isItem memberId, 'member'
    memberId = memberId.id
  unless @isId memberId
    throw new TSArgsError 'teamsnap.deleteMemberPhoto', "`memberId` must be
      a valid id"

  params = memberId: memberId
  @collections.members.exec('removeMemberPhoto', params)
    .pop().callback callback


exports.generateMemberThumbnail = (memberId, x, y, width, height, callback) ->
  if @isItem memberId, 'member'
    memberId = memberId.id
  unless memberId? and x? and y? and width? and height?
    throw new TSArgsError 'teamsnap.generateThumbnail', "`memberId`, `x`, `y`,
      `width`, and `height` are all required"
  unless @isId memberId
    throw new TSArgsError 'teamsnap.generateMemberThumbnail', "`memberId` must
      be a valid id"

  params =
    memberId: memberId
    x: x
    y: y
    width: width
    height: height
  @collections.members.exec('generateMemberThumbnail', params)
    .pop().callback callback


exports.disableMember = (memberId, callback) ->
  if @isItem memberId, 'member'
    memberId = memberId.id
  unless @isId memberId
    throw new TSArgsError 'teamsnap.disableMember', "`memberId` must
      be a valid id"

  params = memberId: memberId
  @collections.members.exec('disableMember', params)
    .pop().callback callback


# Helper to output a member's name, forward or reverse (reverse will use comma)
exports.memberName = (member, reverse, forSort) ->
  return '' unless member
  if reverse and (member.firstName and member.lastName or forSort)
    return member.lastName + ', ' + member.firstName
  [ member.firstName or '', member.lastName or '' ].join(' ').trim()


# Returns a sorting function to sort members by firstName, lastName (or reverse)
exports.getMemberSort = (reverse) ->
  (itemA, itemB) =>
    if !@isItem(itemA, 'member') or !@isItem(itemB, 'member')
      valueA = itemA.type
      valueB = itemB.type
    else
      valueA = @memberName(itemA, reverse, true).toLowerCase()
      valueB = @memberName(itemB, reverse, true).toLowerCase()
    # Let's try to use `localeCompare()` if available
    if typeof valueA.localeCompare is 'function'
      valueA.localeCompare valueB
    else
      if valueA is valueB then 0
      else if !valueA and valueB then 1
      else if valueA and !valueB then -1
      else if valueA > valueB then 1
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
    item.href is member.href
  else
    item.links.member.href is member.href
