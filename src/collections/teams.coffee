# Loads all teams the current user has access to
exports.loadTeams = (params = {}, callback) ->
  if typeof params is 'function'
    callback = params
    params = {}
  if Object.keys(params).length
    @loadItems 'team', params, callback
  else
    @loadMe().then (me) =>
      params.userId = me.id
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
  if typeof teamId is 'object' and !Array.isArray(teamId)
    # Using params object (smartload)
    loadParams = teamId
    teamId = loadParams.teamId
    types = loadParams.types

  unless @isId(teamId) or
  (Array.isArray(teamId) and @isId(teamId[0]))
    throw new TSArgsError 'teamsnap.bulkLoad', 'teamId must be provided'

    if typeof types is 'function'
      callback = types
      types = null

  unless Array.isArray types
    types = @getTeamTypes()
    types.splice types.indexOf('availability'), 1

  params = teamId: teamId, types: types.map(@underscoreType).join(',')
  if loadParams?
    if loadParams.scopeTo?
      params.scopeTo = @underscoreType(loadParams.scopeTo)
    # Check loadParams for filters
    for key, value of loadParams
      if key.indexOf('__') isnt -1
        params[key] = value

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


exports.updateTimeZone = (options = {}) ->

  unless options.timeZone
    throw new TSArgsError 'teamsnap.updateTimeZone',
      'options.timeZone is required.'

  unless options.teamId
    throw new TSArgsError 'teamsnap.updateTimeZone',
      'options.teamId is required.'

  unless options.offsetTeamTimes
    throw new TSArgsError 'teamsnap.updateTimeZone',
      'options.offsetTeamTimes is required'

  @collections.teams.exec('updateTimeZone', options)


exports.resetStatistics = (teamId, callback) ->
  unless teamId
    throw new TSArgsError 'teamsnap.resetStatistics',
      "`teamId` must be provided"
  if @isItem teamId, 'teamId'
    teamId = teamId.id
  if not @isId teamId
    throw new TSArgsError 'teamsnap.resetStatistics',
      "`teamId` must be a valid id"

  params = teamId: teamId
  @collections.teams.exec('resetStatistics', params)
  .callback callback


exports.divisionLoadTeams = (params, callback) ->
  unless params.divisionId
    throw new TSArgsError 'teamsnap.divisionLoadTeams',
      "`divisionId` must be provided"

  @collections.teams.queryItems('divisionSearch', params, callback)


# Converts memberId or memberIds into an array
cleanArray = (obj, prop) ->
  plural = prop + 's'
  if obj[plural]
    obj[prop] = obj[plural]
    delete obj[plural]
  if obj[prop]? and not Array.isArray obj[prop]
    obj[prop] = [ obj[prop] ]
  obj
