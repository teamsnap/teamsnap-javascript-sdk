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

exports.sendAssignmentEmails = (teamId, eventIds, message, sendingMemberId, callback) ->
  unless @isId teamId
    throw new TSArgsError 'teamsnap.sendAssignmentEmails', "must provide
    a `teamId`"
  unless eventIds
    throw new TSArgsError 'teamsnap.sendAssignmentEmails', "must provide
    `eventIds`"
  if @isItem eventIds
    eventIds = eventIds.id
  unless @isId sendingMemberId
    throw new TSArgsError 'teamsnap.sendAssignmentEmails', "must provide
    a `sendingMemberId`"

  params = teamId: teamId, eventIds: eventIds, message: message, sendingMemberId: sendingMemberId
  @collections.assignments.exec 'sendAssignmentEmails', params, callback

exports.reorderAssignments = (eventId, assignmentIds, callback) ->
  unless @isId eventId
    throw new TSArgsError 'teamsnap.reorderAssignments', '`eventId`
      must be provided'
  unless assignmentIds and Array.isArray assignmentIds
    throw new TSArgsError 'teamsnap.reorderAssignments', 'You must provide
      an array of ordered Assignments IDs'

  params = eventId: eventId, sortedIds: assignmentIds
  @collections.assignments.exec('reorderAssignments', params)
    .callback callback

exports.createBulkAssignments = (eventSet, description, teamId, createAsMemberId, callback) ->
  unless eventSet
    throw new TSArgsError 'teamsnap.createBulkAssignments',
    " `eventSet` must be provided."
  unless description.trim()
    return @reject 'You must provide a description for the assignments.',
      'description', callback
  if @isItem teamId, 'team'
    teamId = teamId.id
  unless @isId teamId
    throw new TSArgsError 'teamsnap.createBulkAssignments',
    "`teamId` must be provided."
  if @isItem createAsMemberId, 'member'
    createAsMemberId = createAsMemberId.id
  unless @isId createAsMemberId
    throw new TSArgsError 'teamsnap.createBulkAssignments',
    "`teamId` must be provided."

  params = eventSet: eventSet, description: description, teamId: teamId, createAsMemberId: createAsMemberId
  @collections.assignments.exec 'createBulkAssignments', params, callback
