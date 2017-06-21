exports.loadInvoiceTransactions = (params, callback) ->
  unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadInvoiceTransactions',
      'must provide query parameters'

  @loadItems 'invoiceTransaction', params, callback

exports.createInvoiceTransaction = (data) ->
  @createItem data,
    type: 'invoiceTransaction'


exports.saveInvoiceTransaction = (invoiceTransaction, callback) ->
  unless invoiceTransaction
    throw new TSArgsError 'teamsnap.saveInvoiceTransaction',
      "`invoiceTransaction` must be provided"
  unless @isItem invoiceTransaction, 'invoiceTransaction'
    throw new TSArgsError 'teamsnap.saveInvoiceTransaction',
      "`invoiceTransaction.type` must be 'invoiceTransaction'"
  unless invoiceTransaction.invoiceId
    return @reject 'You must provide an invoice.', 'invoiceId', callback
  unless invoiceTransaction.kind
    return @reject 'You must provide a kind of invoice.', 'kind', callback
  unless invoiceTransaction.amount
    return @reject 'You must provide an amount.', 'amount', callback

  @saveItem invoiceTransaction, callback
