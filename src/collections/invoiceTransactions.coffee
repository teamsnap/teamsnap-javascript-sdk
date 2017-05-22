exports.loadInvoiceTransactions = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadInvoiceTransactions',
      'must provide query parameters'

  @loadItems 'invoiceTransaction', params, callback
