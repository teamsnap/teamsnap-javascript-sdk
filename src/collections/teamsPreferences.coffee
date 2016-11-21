exports.ASSIGNMENTS_ENABLED_FOR_CODE =
  GamesAndEvents: 0
  Games: 1
  Events: 2


exports.loadTeamsPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPreferences', 'must provide a
      teamId or query parameters'

  @loadItems 'teamPreferences', params, callback


# Singular version
exports.loadTeamPreferences = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPreferences', 'must provide a
      teamId or query parameters'

  @loadItem 'teamPreferences', params, callback


exports.saveTeamPreferences = (teamPreferences, callback) ->
  unless teamPreferences
    throw new TSArgsError 'teamsnap.saveTeamPreferences',
      "`teamPreferences` must be provided"
  unless @isItem teamPreferences, 'teamPreferences'
    throw new TSArgsError 'teamsnap.saveTeamPreferences',
      "`teamPreferences.type` must be 'teamPreferences'"

  @saveItem teamPreferences, callback


exports.uploadTeamPhoto = (teamPreferencesId, file, callback) ->
  if @isItem teamPreferencesId, 'teamPreferences'
    teamPreferencesId = teamPreferencesId.id
  if typeof FormData is 'undefined'
    @reject 'Your browser does not support the new file upload APIs.', 'file',
      callback
  unless @isId teamPreferencesId
    throw new TSArgsError 'teamsnap.uploadTeamPhoto', 'must include
      `teamPreferencesId`'
  unless file instanceof File
    throw new TSArgsError 'teamsnap.uploadTeamPhoto', 'must include
      `file` as type File'

  params = teamPreferencesId: teamPreferencesId, file: file
  @collections.teamsPreferences.exec('uploadTeamPhoto', params)
    .pop().callback callback


exports.deleteTeamPhoto = (teamPreferencesId, callback) ->
  unless teamPreferencesId
    throw new TSArgsError 'teamsnap.deleteTeamPhoto',
      "`teamPreferencesId` must be provided"
  if @isItem teamPreferencesId, 'teamPreferences'
    teamPreferencesId = teamPreferences.id
  if not @isId teamPreferencesId
    throw new TSArgsError 'teamsnap.deleteTeamPhoto',
      "`teamPreferencesId` must be a valid id"

  params = teamPreferencesId: teamPreferencesId
  @collections.teamsPreferences.exec('removeTeamPhoto', params)
  .callback callback


exports.uploadTeamLogo = (teamPreferencesId, file, callback) ->
  if @isItem teamPreferencesId, 'teamPreferences'
    teamPreferencesId = teamPreferences.id
  if typeof FormData is 'undefined'
    @reject 'Your browser does not support the new file upload APIs.', 'file',
      callback
  unless @isId teamPreferencesId
    throw new TSArgsError 'teamsnap.uploadTeamLogo', 'must include
      `teamPreferencesId`'
  unless file instanceof File
    throw new TSArgsError 'teamsnap.uploadTeamLogo', 'must include
      `file` as type File'

  params = teamPreferencesId: teamPreferencesId, file: file
  @collections.teamsPreferences.exec('uploadTeamLogo', params)
    .pop().callback callback


exports.deleteTeamLogo = (teamPreferencesId, callback) ->
  unless teamPreferencesId
    throw new TSArgsError 'teamsnap.deleteTeamLogo',
      "`teamPreferencesId` must be provided"
  if @isItem teamPreferencesId, 'teamPreferences'
    teamPreferencesId = teamPreferences.id
  if not @isId teamPreferencesId
    throw new TSArgsError 'teamsnap.deleteTeamLogo',
      "`teamPreferencesId` must be a valid id"

  params = teamPreferencesId: teamPreferencesId
  @collections.teamsPreferences.exec('removeTeamLogo', params)
  .callback callback
