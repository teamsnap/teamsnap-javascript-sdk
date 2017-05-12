# Load batchInvoices by divisionId or query parameters
exports.loadBatchInvoices = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadBatchInvoices',
      'must provide a query parameters'

  @loadItems 'batchInvoice', params, callback


exports.createBatchInvoice = (data) ->
  @createItem data,
    type: 'batchInvoice'


exports.saveBatchInvoice = (batchInvoice, callback) ->
  unless batchInvoice
    throw new TSArgsError 'teamsnap.saveBatchInvoice',
      "`batchInvoice` must be provided"
  unless @isItem batchInvoice, 'batchInvoice'
    throw new TSArgsError 'teamsnap.saveBatchInvoice',
      "`batchInvoice.type` must be 'batchInvoice'"
  unless batchInvoice.divisionId
    return @reject 'You must provide a division.', 'divisionId', callback
  unless batchInvoice.description?.trim()
    return @reject 'You must provide a description for the batchInvoice.',
      'description', callback

  @saveItem batchInvoice, callback


exports.deleteBatchInvoice = (batchInvoice, callback) ->
  unless batchInvoice
    throw new TSArgsError 'teamsnap.deleteBatchInvoice',
      '`batchInvoice` must be provided'

  @deleteItem batchInvoice, callback
