exports.loadRegistrationFormLineItemOptions = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadRegistrationFormLineItemOptions','must provide query parameters'

  @loadItems 'registrationFormLineItemOption', params, callback
