# Loads reference to Facebook pages / ids for current user.
exports.loadUserFacebookPages = (callback) ->
  params = {}
  @loadItems 'userFacebookPage', params, callback
