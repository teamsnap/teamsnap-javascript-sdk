
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
  unless phoneNumber.contactId
    return @reject 'You must choose a contact.', 'contactId', callback

  @saveItem phoneNumber, callback


exports.deleteContactPhoneNumber = (phoneNumber, callback) ->
  unless phoneNumber
    throw new TSArgsError 'teamsnap.deleteContactPhoneNumber',
      '`phoneNumber` must be provided'

  @deleteItem phoneNumber, callback
