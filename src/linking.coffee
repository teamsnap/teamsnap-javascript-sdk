# Provides functionality for associating items together (looking at their links
# and setting references to each other on the items, such as setting the member
# on an availability or all members in an array on a team).
types = require './types'

# associates a list of items with each other by their links, returning a
# function which can be called to undo associating these items
exports.linkItems = (items, lookup = {}) ->
  return (->) unless items
  if Array.isArray items
    items.forEach (item) -> lookup[item.href] = item if item.href
    undos = items.map (item) -> linkItem(item, lookup)
    groupUndos(undos)
  else
    lookup[items.href] = items if items.href
    linkItem(items, lookup)


# disassociates a list of items with each that were associated, returning a
# function which can be called to undo the disassociation.
exports.unlinkItems = (items, lookup = {}) ->
  return (->) unless items
  if Array.isArray items
    undos = items.map (item) -> unlinkItem(item, lookup)
    groupUndos(undos)
  else
    unlinkItem items


linkItem = (item, lookup) ->
  return unless item.href
  throw new TSArgsError('linkItem', 'lookup must be provided') unless lookup
  undos = []
  undos.push undoableAdd(lookup, item.href, item)
  item.links.each (rel, href) ->
    if types.isPluralType rel
      undos.push undoableAdd(item, rel, [])
    else
      return unless (related = lookup[href])
      undos.push undoableAdd(item, rel, related)
      undos.push linkItemWith(item, related)
  groupUndos(undos)


linkItemWith = (item, other) ->
  undos = []
  plural = types.getPluralType item.type
  if plural and other.links.has plural
    undos.push undoableAddTo(other, plural, item)
  else
    other.links.each (rel, href) ->
      if href is item.href
        undos.push undoableAdd(other, rel, item)
  groupUndos undos


unlinkItem = (item, lookup) ->
  return unless item.href
  undos = []
  if lookup?[item.href] is item
    undos.push undoableRemove(lookup, item.href)

  item.links.each (rel, href) ->
    if types.isPluralType rel
      if item[rel]
        undos.push unlinkItemsFrom(item[rel], item.href)
        undos.push undoableRemove(item, rel)
    else
      related = item[rel]
      undos.push undoableRemove(item, rel)
      undos.push unlinkItemFrom(item, related)
  groupUndos(undos)


unlinkItemFrom = (item, other) ->
  undos = []
  plural = types.getPluralType item.type
  if plural and other.links.has(plural) and other[plural] is item
    undos.push undoableRemoveFrom(other, plural, item)
  else
    other.links.each (rel, href) ->
      if href is item.href and other[rel] is item
        undos.push undoableRemove(other, rel)
  groupUndos undos


# disassociate the list of items from only the item with href `fromHref`
unlinkItemsFrom = (items, fromHref) ->
  undos = []
  items.forEach (item) ->
    item.links.each (rel, href) ->
      if href is fromHref
        undos.push undoableRemove(item, rel)
  groupUndos(undos)


# groups an array of undos into a single undo function
groupUndos = (undos) ->
  -> undos.forEach (undo) -> undo()

# adds a property to an object, providing an undo function
undoableAdd = (item, property, value) ->
  exists = item.hasOwnProperty(property)
  oldValue = item[property]
  item[property] = value
  ->
    if exists
      item[property] = oldValue
    else
      delete item[property]

# adds an item to an object's array, providing an undo function
undoableAddTo = (item, property, value) ->
  item[property] = [] unless item[property]
  item[property].push value
  ->
    if item[property]
      index = item[property].indexOf value
      item[property].splice(index, 1) if index isnt -1

# removes a property from an object, providing an undo function
undoableRemove = (item, property) ->
  oldValue = item[property]
  delete item[property]
  -> item[property] = oldValue

# removes an item from an object's array, providing an undo function
undoableRemoveFrom = (item, property, value) ->
  index = item[property].indexOf(value)
  return (->) if index is -1
  item[property].splice(index, 1)
  ->
    item[property] = [] unless item[property]
    length = item[property].length
    item[property].splice(index, 0, item)
    # If the splice didn't work because the index is no longer valid
    if item[property].length is length
      item[property].push value


exports.linkItem = linkItem
exports.linkItemWith = linkItemWith
exports.unlinkItem = unlinkItem
exports.unlinkItemFrom = unlinkItemFrom
exports.unlinkItemsFrom = unlinkItemsFrom
exports.groupUndos = groupUndos
exports.undoableAdd = undoableAdd
exports.undoableAddTo = undoableAddTo
exports.undoableRemove = undoableRemove
exports.undoableRemoveFrom = undoableRemoveFrom
