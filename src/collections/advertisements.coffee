exports.loadAdvertisements = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadAdvertisements', 'must provide a
      teamId or query parameters'

  @loadItems 'advertisement', params, callback
