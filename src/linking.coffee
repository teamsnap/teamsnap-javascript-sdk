# Provides functionality for associating items together (looking at their links
# and setting references to each other on the items, such as setting the member
# on an availability or all members in an array on a team).
types = require './types'

# associates a list of items with each other by their links
exports.linkItems = (items, lookup = {}) ->
  return (->) unless items
  if Array.isArray items
    items.forEach (item) -> lookup[item.href] = item if item.href
    items.forEach (item) -> linkItem(item, lookup)
  else
    lookup[items.href] = items if items.href
    linkItem(items, lookup)


# disassociates a list of items with each that were associated
exports.unlinkItems = (items, lookup = {}) ->
  return (->) unless items
  if Array.isArray items
    items.forEach (item) -> unlinkItem(item, lookup)
  else
    unlinkItem items


linkItem = (item, lookup) ->
  return unless item.href
  throw new TSArgsError('linkItem', 'lookup must be provided') unless lookup
  lookup[item.href] = item
  item.links.each (rel, href) ->
    if types.isPluralType rel
      item[rel] = [] unless item[rel]
    else
      return unless (related = lookup[href])
      item[rel] = related
      linkItemWith(item, related)


linkItemWith = (item, other) ->
  plural = types.getPluralType item.type
  if plural and other.links.has plural
    other[plural] = [] unless other[plural]
    unless other[plural].indexOf(item) isnt -1
      other[plural].push item
  else
    other.links.each (rel, href) ->
      if href is item.href
        other[rel] = item


unlinkItem = (item, lookup) ->
  return unless item.href
  if lookup?[item.href] is item
    delete lookup[item.href]

  item.links.each (rel, href) ->
    if types.isPluralType rel
      if item[rel]
        unlinkItemsFrom(item[rel], item.href)
        delete item[rel]
    else
      related = item[rel]
      delete item[rel]
      unlinkItemFrom(item, related)


unlinkItemFrom = (item, other) ->
  plural = types.getPluralType item.type
  if plural and other.links.has(plural) and other[plural]
    index = other[plural].indexOf(item)
    other[plural].splice(index, 1) if index isnt -1
  else
    other.links.each (rel, href) ->
      if href is item.href and other[rel] is item
        delete other[rel]


# disassociate the list of items from only the item with href `fromHref`
unlinkItemsFrom = (items, fromHref) ->
  items.forEach (item) ->
    item.links.each (rel, href) ->
      if href is fromHref
        delete item[rel]


exports.linkItem = linkItem
exports.linkItemWith = linkItemWith
exports.unlinkItem = unlinkItem
exports.unlinkItemFrom = unlinkItemFrom
exports.unlinkItemsFrom = unlinkItemsFrom
