
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


exports.saveContactEmailAddress = (contactEmailAddress, callback) ->
  unless contactEmailAddress
    throw new TSArgsError 'teamsnap.saveContactEmailAddress',
      '`contactEmailAddress` must be provided'
  unless @isItem contactEmailAddress, 'contactEmailAddress'
    throw new TSArgsError 'teamsnap.saveContactEmailAddress',
      "`contactEmailAddress.type` must be 'contactEmailAddress'"
  unless contactEmailAddress.contactId
    return @reject 'You must choose a contact.', 'contactId', callback

  @saveItem contactEmailAddress, callback


exports.deleteContactEmailAddress = (contactEmailAddress, callback) ->
  unless contactEmailAddress
    throw new TSArgsError 'teamsnap.deleteContactEmailAddress',
      '`contactEmailAddress` must be provided'

  @deleteItem contactEmailAddress, callback
