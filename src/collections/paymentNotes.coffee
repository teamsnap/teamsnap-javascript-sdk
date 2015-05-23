exports.loadPaymentNotes = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadPaymentNotes', 'must provide a
      teamId or query parameters'

  @loadItems 'paymentNote', params, callback


exports.createPaymentNote = (data) ->
  @createItem data,
    type: 'paymentNote'


exports.savePaymentNote = (paymentNote, callback) ->
  unless paymentNote
    throw new TSArgsError 'teamsnap.savePaymentNote', '`paymentNote`
      must be provided'
  unless @isItem paymentNote, 'paymentNote'
    throw new TSArgsError 'teamsnap.savePaymentNote',
      "`paymentNote.type` must be 'paymentNote'"
  unless paymentNote.teamId
    return @reject 'You must choose a team.', 'teamId', callback
  unless paymentNote.memberPaymentId
    return @reject 'You must specify a memberPaymentId.',
    'memberPaymentId', callback
  unless paymentNote.note
    return @reject 'You must provide a note.', 'note', callback
  unless paymentNote.description
    return @reject 'You must provide a description.', 'description', callback
  @saveItem paymentNote, callback