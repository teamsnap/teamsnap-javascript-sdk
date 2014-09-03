# Load contacts by teamId or query parameters
exports.loadContacts = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadContacts', 'must provide a teamId or
      query parameters'

  @loadItems 'contacts', params, callback


exports.createContact = (data) ->
  @createItem data,
    type: 'contact'


exports.saveContact = (contact, callback) ->
  unless contact
    throw new TSArgsError 'teamsnap.saveContact', "`contact` must be provided"
  unless @isItem contact, 'contact'
    throw new TSArgsError 'teamsnap.saveContact',
      "`contact.type` must be 'contact'"
  unless contact.memberId
    return @reject 'You must choose a member.', 'memberId', callback
  unless contact.firstName?.trim()
    return @reject 'You must provide a firstName for the contact.', 'name',
      callback

  @saveItem contact, callback


exports.deleteContact = (contact) ->
  unless contact
    throw new TSArgsError 'teamsnap.deleteContact',
      '`contact` must be provided'

  @deleteItem contact


# Contact Emails
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

  @saveItem emailAddress, callback


exports.loadContactPhoneNumbers = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadContactPhoneNumbers', 'must provide a
      teamId or query parameters'

  @loadItems 'contactPhoneNumber', params, callback


exports.createContactPhoneNumber = (data) ->
  @createItem data,
    type: 'contactPhoneNumber'


exports.saveContactPhoneNumber = (phoneNumber, callback) ->
  unless phoneNumber
    throw new TSArgsError 'teamsnap.saveContactPhoneNumber', '`phoneNumber`
      must be provided'
  unless @isItem phoneNumber, 'contactPhoneNumber'
    throw new TSArgsError 'teamsnap.saveContactPhoneNumber',
      "`phoneNumber.type` must be 'contactPhoneNumber'"

  @saveItem phoneNumber, callback