# Loads reference to Facebook pages / ids for current user.
exports.loadFacebookPages = (callback) ->
  params = {}
  @loadItems 'facebookPage', params, callback
