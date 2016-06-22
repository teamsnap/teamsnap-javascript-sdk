exports.loadTeamPhotos = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPhotos', 'must provide a `teamId` or
      query parameters'

  @loadItems 'teamPhoto', params, callback

exports.loadTeamPhoto = (params, callback) ->
  if @isId params
    params = id: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadTeamPhoto', 'must provide an `id` or
      query parameters'

  @loadItem 'teamPhoto', params, callback
