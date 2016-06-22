exports.loadMemberPhotos = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberPhotos', 'must provide a
      `teamId` or query parameters'

  @loadItems 'memberPhoto', params, callback

exports.loadMemberPhoto = (params, callback) ->
  if @isId params
    params = id: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadMemberPhoto', 'must provide an `id` or
      query parameters'

  @loadItem 'memberPhoto', params, callback
