promises = require './promises'
model = require './model'
auth = require './auth'
require './errors'

teamsnap = exports
teamsnap.Collection = model.Collection
teamsnap.Item = model.Item
teamsnap.promises = promises
teamsnap.apiUrl = 'https://api.teamsnap.com/v3/'
teamsnap.authUrl = 'https://auth.teamsnap.com'
teamsnap.version = '1.0.0'

# Returns a teamsnap object for authing users. Only provide the secret when
# running on the server!
teamsnap.init = (clientId, secret) ->
  for name, method of auth clientId, secret
    teamsnap[name] = method
  teamsnap

unless String::trim
  String::trim = -> @replace /^\s+|\s+$/g, ''