# Load invoiceLineItems by divisionId or query parameters
exports.loadInvoiceLineItems = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadInvoiceLineItems',
      'must provide query parameters'

  @loadItems 'invoiceLineItem', params, callback


exports.createInvoiceLineItem = (data) ->
  @createItem data,
    type: 'invoiceLineItem'


exports.saveInvoiceLineItem = (invoiceLineItem, callback) ->
  unless invoiceLineItem
    throw new TSArgsError 'teamsnap.saveInvoiceLineItem',
      "`invoiceLineItem` must be provided"
  unless @isItem invoiceLineItem, 'invoiceLineItem'
    throw new TSArgsError 'teamsnap.saveInvoiceLineItem',
      "`invoiceLineItem.type` must be 'invoiceLineItem'"
  unless invoiceLineItem.batchInvoiceId
    return @reject 'You must choose a batchInvoiceId.', 'batchInvoiceId',
      callback
  unless invoiceLineItem.quantity
    return @reject 'You must provide a quantity.', 'quantity',
      callback
  unless invoiceLineItem.amount
    return @reject 'You must provide a amount.', 'amount',
      callback

  @saveItem invoiceLineItem, callback


exports.deleteInvoiceLineItem = (invoiceLineItem, callback) ->
  unless invoiceLineItem
    throw new TSArgsError 'teamsnap.deleteInvoiceLineItem',
      '`invoiceLineItem` must be provided'

  @deleteItem invoiceLineItem, callback
