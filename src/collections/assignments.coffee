exports.loadAssignments = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadAssignments', 'must provide a
      teamId or query parameters'

  @loadItems 'assignment', params, callback

exports.createAssignment = (data) ->
  @createItem data,
    type: 'assignment'
    description: ''

exports.saveAssignment = (assignment, callback) ->
  unless assignment
    throw new TSArgsError 'teamsnap.saveAssignment',
      "`assignment` must be provided"
  unless @isItem assignment, 'assignment'
    throw new TSArgsError 'teamsnap.saveAssignment',
      "`assignment.type` must be 'assignment'"
  unless assignment.eventId
    return @reject 'You must choose an event.', 'eventId', callback
  unless assignment.description?.trim()
    return @reject 'You must provide a description for the assignment.',
      'name', callback

  @saveItem assignment, callback

exports.deleteAssignment = (assignment, callback) ->
  unless assignment
    throw new TSArgsError 'teamsnap.deleteAssignment',
      '`assignment` must be provided'

  @deleteItem assignment, callback

# Sorts assignments by their member, must have assignment.member set to
# correctly sort
exports.getAssignmentSort = (reverse) ->
  (itemA, itemB) =>
    if !@isItem(itemA, 'assignment') or !@isItem(itemB, 'assignment')
      valueA = itemA.type
      valueB = itemB.type
    else
      valueA = @memberName(itemA.member, reverse).toLowerCase()
      valueB = @memberName(itemB.member, reverse).toLowerCase()
    # Let's try to use `localeCompare()` if available
    if typeof valueA?.localeCompare is 'function'
      valueA.localeCompare valueB
    else
      if valueA is valueB then 0
      else if !valueA and valueB then 1
      else if valueA and !valueB then -1
      else if valueA > valueB then 1
      else if valueA < valueB then -1
      else 0

exports.optOutOfAssignments = (assignmentIds, callback) ->
  unless assignmentIds
    throw new TSArgsError 'teamsnap.optOutOfAssignments', 'must include
    `assignmentIds`'
  if @isItem assignmentIds
    assignmentIds = assignmentIds.id
  params = assignmentIds: assignmentIds
  @collections.assignments.exec('optOutOfAssignments', params)
  .pop().callback callback

exports.volunteerForAssignments = (assignmentIds, memberId, callback) ->
  unless assignmentIds
    throw new TSArgsError 'teamsnap.volunteerForAssignments', "must include
    `assignmentIds`"
  if @isItem assignmentIds
    assignmentIds = assignmentIds.id
  unless memberId
    throw new TSArgsError 'teamsnap.volunteerForAssignments', "must provide
     a memberId"
  if @isItem memberId
    memberId = memberId.id

  params = assignmentIds: assignmentIds, memberId: memberId
  @collections.assignments.exec 'volunteerForAssignments', params, callback

exports.sendAssignmentEmails = (teamId, eventIds, message, callback) ->
  unless teamId
    thrown new TSArgsError 'teamsnap.sendAssignmentEmails', "must provide
    a `teamId`"
  unless eventIds
    throw new TSArgsError 'teamsnap.sendAssignmentEmails', "must provide
    `eventIds`"
  if @isItem eventIds
    eventIds = eventIds.id

  params = teamId: teamId, eventIds: eventIds, message: message
  @collections.assignments.exec 'sendAssignmentEmails', params, callback
