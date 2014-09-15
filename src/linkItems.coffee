linking = require './linking'

# associates a list of items with each other by their links, returning a
# function which can be called to undo associating these items
exports.linkItems = linking.linkItems

# disassociates a list of items with each that were associated, returning a
# function which can be called to undo the disassociation.
exports.unlinkItems = linking.unlinkItems
