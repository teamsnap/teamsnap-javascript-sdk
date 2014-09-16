# Loads all teams the current user has access to
exports.loadTeams = (params = {}, callback) ->
  if typeof params is 'function'
    callback = params
    params = {}
  params.userId = @me.id
  @loadItems 'team', params, callback


# Load a single team
exports.loadTeam = (teamId, callback) ->
  unless @isId teamId
    throw new TSArgsError 'teamsnap.loadTeam', 'teamId must be provided'
  @loadItem 'team', teamId: teamId, callback


exports.createTeam = (data) ->
  @createItem data,
    type: 'team'
    name: ''


exports.saveTeam = (team, callback) ->
  unless team
    throw new TSArgsError 'teamsnap.saveTeam', "`team` must be provided"
  unless @isItem team, 'team'
    throw new TSArgsError 'teamsnap.saveTeam', "`type` must be 'team'"
  unless team.name?.trim()
    return @reject 'You must provide a name for the team.', 'name', callback

  @saveItem team, callback


exports.deleteTeam = (team, callback) ->
  unless team
    throw new TSArgsError 'teamsnap.deleteTeam',
      '`team` must be provided'

  @deleteItem team, callback



# Loads all items associated with a team, optionally limited by the types array
exports.bulkLoad = (teamId, types, callback) ->
  unless @isId teamId
    throw new TSArgsError 'teamsnap.bulkLoad', 'teamId must be provided'

  if typeof types is 'function'
    callback = types
    types = null

  unless Array.isArray types
    types = @getTeamTypes()

  # TODO uncomment this and remove the following two lines after switching type
  # params = teamId: teamId, types: types.map(@underscoreType).join(',')
  capitalize = (str) ->
    str = 'refreshment' if str is 'assignment'
    str[0].toUpperCase() + str.slice(1)
  params = teamId: teamId, types: types.map(capitalize).join(',')
  @collections.root.queryItems 'bulkLoad', params, callback


exports.invite = (options = {}) ->
  cleanArray options, 'memberId'
  cleanArray options, 'contactId'

  unless options.memberId or options.contactId
    throw new TSArgsError 'teamsnap.invite', 'options.memberId or
      options.contactId is required.'

  unless options.teamId
    throw new TSArgsError 'teamsnap.invite', 'options.teamId is required.'

  unless options.notifyAsMemberId
    throw new TSArgsError 'teamsnap.invite', 'options.notifyAsMemberId is
      required.'

  @collections.teams.exec('invite', options)

# Converts memberId or memberIds into an array
cleanArray = (obj, prop) ->
  plural = prop + 's'
  if obj[plural]
    obj[prop] = obj[plural]
    delete obj[plural]
  if Array.isArray obj[prop]
    obj[prop] = obj[prop].join(',')
  obj
