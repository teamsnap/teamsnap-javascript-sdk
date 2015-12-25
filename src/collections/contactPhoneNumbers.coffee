
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


exports.saveContactPhoneNumber = (contactPhoneNumber, callback) ->
  unless contactPhoneNumber
    throw new TSArgsError 'teamsnap.saveContactPhoneNumber',
      '`contactPhoneNumber` must be provided'
  unless @isItem contactPhoneNumber, 'contactPhoneNumber'
    throw new TSArgsError 'teamsnap.saveContactPhoneNumber',
      "`contactPhoneNumber.type` must be 'contactPhoneNumber'"
  unless contactPhoneNumber.contactId
    return @reject 'You must choose a contact.', 'contactId', callback

  @saveItem contactPhoneNumber, callback


exports.deleteContactPhoneNumber = (contactPhoneNumber, callback) ->
  unless contactPhoneNumber
    throw new TSArgsError 'teamsnap.deleteContactPhoneNumber',
      '`contactPhoneNumber` must be provided'

  @deleteItem contactPhoneNumber, callback
