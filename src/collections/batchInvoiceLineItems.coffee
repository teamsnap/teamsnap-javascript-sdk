exports.loadBatchInvoiceLineItems = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadBatchInvoiceLineItems',
      'must provide query parameters'

  @loadItems 'batchInvoiceLineItem', params, callback


exports.createBatchInvoiceLineItem = (data) ->
  @createItem data,
    type: 'batchInvoiceLineItem'


exports.saveBatchInvoiceLineItem = (batchInvoiceLineItem, callback) ->
  unless batchInvoiceLineItem
    throw new TSArgsError 'teamsnap.saveBatchInvoiceLineItem',
      "`batchInvoiceLineItem` must be provided"
  unless @isItem batchInvoiceLineItem, 'batchInvoiceLineItem'
    throw new TSArgsError 'teamsnap.saveBatchInvoiceLineItem',
      "`batchInvoiceLineItem.type` must be 'batchInvoiceLineItem'"
  unless batchInvoiceLineItem.batchInvoiceId
    return @reject 'You must choose a batchInvoiceId.', 'batchInvoiceId',
      callback
  unless batchInvoiceLineItem.quantity
    return @reject 'You must provide a quantity.', 'quantity',
      callback
  unless batchInvoiceLineItem.amount
    return @reject 'You must provide an amount.', 'amount',
      callback

  @saveItem batchInvoiceLineItem, callback


exports.deleteBatchInvoiceLineItem = (batchInvoiceLineItem, callback) ->
  unless batchInvoiceLineItem
    throw new TSArgsError 'teamsnap.deleteBatchInvoiceLineItem',
      '`batchInvoiceLineItem` must be provided'

  @deleteItem batchInvoiceLineItem, callback
