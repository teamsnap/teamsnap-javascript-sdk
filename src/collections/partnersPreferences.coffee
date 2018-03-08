exports.loadPartnersPreferences = (params, callback) ->
  if @isId params
    params = memberId: params
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadPartnersPreferences', 'must provide a
      memberId or query parameters'

  @loadItems 'partnerPreferences', params, callback
