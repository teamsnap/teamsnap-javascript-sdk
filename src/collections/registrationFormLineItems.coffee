exports.loadRegistrationFormLineItems = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadRegistrationFormLineItems', 'must provide query parameters'

  @loadItems 'registrationFormLineItem', params, callback
