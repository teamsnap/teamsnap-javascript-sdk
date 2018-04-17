exports.createPartnerUserPreferences = (data) ->
  @createItem data,
    type: 'partnerUserPreferences'

exports.savePartnerUserPreferences = (partnerUserPreferences, callback) ->
  unless partnerUserPreferences
    throw new TSArgsError 'teamsnap.savePartnerUserPreferences',
      "`partnerUserPreferences` must be provided"
  unless @isItem partnerUserPreferences, 'partnerUserPreferences'
    throw new TSArgsError 'teamsnap.savePartnerUserPreferences',
      "`partnerUserPreferences.type` must be 'partnerUserPreferences'"
  unless partnerUserPreferences.userId
    return @reject 'You must provide a user.', 'userId', callback
  unless partnerUserPreferences.partnerPreferenceId
    return @reject 'You must provide a partnerPreference.',
      'partnerPreferenceId', callback
  unless partnerUserPreferences.optionValue.trim()
    return @reject 'You must provide an optionValue.', 'optionValue', callback

  @saveItem partnerUserPreferences, callback
