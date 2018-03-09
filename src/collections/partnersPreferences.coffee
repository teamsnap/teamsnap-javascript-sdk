exports.loadPartnersPreferences = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadPartnersPreferences', 'must provide
      query parameters'

  @loadItems 'partnerPreferences', params, callback
