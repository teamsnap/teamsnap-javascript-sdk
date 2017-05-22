exports.loadInvoices = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadInvoices',
      'must provide query parameters'

  @loadItems 'invoice', params, callback


exports.createInvoice = (data) ->
  @createItem data,
    type: 'invoice'


exports.saveInvoice = (invoice, callback) ->
  unless invoice
    throw new TSArgsError 'teamsnap.saveInvoice',
      "`invoice` must be provided"
  unless @isItem invoice, 'invoice'
    throw new TSArgsError 'teamsnap.saveInvoice',
      "`invoice.type` must be 'invoice'"
  unless invoice.batchInvoiceId
    return @reject 'You must choose a batchInvoiceId.', 'batchInvoiceId',
      callback
  unless invoice.memberId
    return @reject 'You must choose a memberId.', 'memberId',
      callback

  @saveItem invoice, callback


exports.deleteInvoice = (invoice, callback) ->
  unless invoice
    throw new TSArgsError 'teamsnap.deleteInvoice',
      '`invoice` must be provided'

  @deleteItem invoice, callback
