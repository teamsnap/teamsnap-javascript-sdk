exports.loadTeamPublicSites = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPublicSites', 'must provide a teamId
      or query parameters'

  @loadItems 'teamPublicSite', params, callback


exports.loadTeamPublicSite = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPublicSite', 'must provide a teamId
      or query parameters'

  @loadItem 'teamPublicSite', params, callback


exports.saveTeamPublicSite = (teamPublicSite, callback) ->
  unless teamPublicSite
    throw new TSArgsError 'teamsnap.saveTeamPublicSite',
      "`teamPublicSite` must be provided"
  unless @isItem teamPublicSite, 'teamPublicSite'
    throw new TSArgsError 'teamsnap.saveTeamPublicSite',
      "`teamPublicSite.type` must be 'teamPublicSite'"

  @saveItem teamPublicSite, callback


exports.uploadTeamPublicPhoto = (teamPublicSiteId, file, callback) ->
  if @isItem teamPublicSiteId, 'teamPublicSite'
    teamPublicSiteId = teamPublicSite.id
  if typeof FormData is 'undefined'
    @reject 'Your browser does not support the new file upload APIs.', 'file',
      callback
  unless @isId teamPublicSiteId
    throw new TSArgsError 'teamsnap.uploadTeamPublicPhoto', 'must include
      `teamPublicSiteId`'
  unless file instanceof File
    throw new TSArgsError 'teamsnap.uploadTeamPublicPhoto', 'must include
      `file` as type File'

  params = teamPublicSiteId: teamPublicSiteId, file: file
  @collections.teamPublicSites.exec('uploadTeamPublicPhoto', params)
    .pop().callback callback


exports.deleteTeamPublicPhoto = (teamPublicSiteId, callback) ->
  unless teamPublicSiteId
    throw new TSArgsError 'teamsnap.deleteTeamPublicPhoto',
      "`teamPublicSiteId` must be provided"
  if @isItem teamPublicSiteId, 'teamPublicSite'
    teamPublicSiteId = teamPublicSite.id
  if not @isId teamPublicSiteId
    throw new TSArgsError 'teamsnap.deleteTeamPublicPhoto',
      "`teamPublicSiteId` must be a valid id"
      
  params = teamPublicSiteId: teamPublicSiteId
  @collections.teamPublicSites.exec('removeTeamPublicPhoto', params)
  .callback callback


exports.validateSubdomain = (subdomain, callback) ->
  unless subdomain
    throw new TSArgsError 'teamsnap.validateSubdomain',
      "`subdomain` must be provided"
      
  params = subdomain: subdomain
  @collections.teamPublicSites.exec('validateSubdomain', params)
  .callback callback
