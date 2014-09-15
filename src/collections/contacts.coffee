# Load contacts by teamId or query parameters
exports.loadContacts = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadContacts', 'must provide a teamId or
      query parameters'

  @loadItems 'contact', params, callback


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


exports.deleteContact = (contact, callback) ->
  unless contact
    throw new TSArgsError 'teamsnap.deleteContact',
      '`contact` must be provided'

  @deleteItem contact, callback
