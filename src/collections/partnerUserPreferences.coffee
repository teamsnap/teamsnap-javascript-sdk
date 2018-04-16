exports.createPartnerUserPreference = (data) ->
  @createItem data,
    type: 'partnerUserPreference'

exports.savePartnerUserPreference = (partnerUserPreference, callback) ->
  unless partnerUserPreference
    throw new TSArgsError 'teamsnap.savePartnerUserPreference', "`partnerUserPreference` must be provided"
  unless @isItem partnerUserPreference, 'partnerUserPreference'
    throw new TSArgsError 'teamsnap.savePartnerUserPreference', "`type` must be 'partnerUserPreference'"
  unless partnerUserPreference.userId
    return @reject 'You must supply a user.', 'userId', callback
  unless partnerUserPreference.partnerPreferenceId
    return @reject 'You must supply a partnerPreference.', 'partnerPreferenceId', callback
  unless partnerUserPreference.optionValue.trim()
    return @reject 'You must supply an optionValue.', 'optionValue', callback

  @saveItem partnerUserPreference, callback
