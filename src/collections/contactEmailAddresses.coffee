
exports.loadContactEmailAddresses = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadContactEmailAddresses', 'must provide a
      teamId or query parameters'

  @loadItems 'contactEmailAddress', params, callback


exports.createContactEmailAddress = (data) ->
  @createItem data,
    type: 'contactEmailAddress'
    receivesTeamEmails: true


exports.saveContactEmailAddress = (emailAddress, callback) ->
  unless emailAddress
    throw new TSArgsError 'teamsnap.saveContactEmailAddress', '`emailAddress`
      must be provided'
  unless @isItem emailAddress, 'contactEmailAddress'
    throw new TSArgsError 'teamsnap.saveContactEmailAddress',
      "`emailAddress.type` must be 'contactEmailAddress'"
  unless emailAddress.contactId
    return @reject 'You must choose a contact.', 'contactId', callback

  @saveItem emailAddress, callback


exports.deleteContactEmailAddress = (emailAddress, callback) ->
  unless emailAddress
    throw new TSArgsError 'teamsnap.deleteContactEmailAddress',
      '`emailAddress` must be provided'

  @deleteItem emailAddress, callback
