exports.loadDSPPayload = (params, callback) ->
  if @isId params
    params = memberId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadDSPPayload', 'must provide a memberId'

  @loadItems 'users/dsp_payload', params, callback
