types = require './types'

camelize = (str) ->
  str.replace /[-_]+(\w)/g, (_, char) ->
    char.toUpperCase()

# Detect customEvent constructor support
hasCustomEventConstructor = (->
  try
    new CustomEvent('test-support')
    return true
  catch
    return false
  )()

eventFactory = (eventName, data) ->
  if hasCustomEventConstructor
    # The _right_ way
    sdkEvent = new CustomEvent(eventName, {detail: data})
  else
    # The deprecated / IE11 way
    sdkEvent = document.createEvent('CustomEvent')
    sdkEvent.initCustomEvent(eventName, true, false, data)

  # Will probably want to put this on something other than document.
  document.dispatchEvent(sdkEvent)

emit = (data) ->
  eventFactory('teamsnap-sdk-event', data)

requestResponse = (method, xhr) ->
  data = xhr.data
  eventData = null

  buildEventDataFromCollection = (collection) ->
    eventData = null

    getIdForItemData = (itemData) ->
      id = null
      itemData.some (field) ->
        if field.name is 'id'
          parsedId = parseInt(field.value)
          id = parsedId if parsedId
          return true
        else
          return false
      return id

    if collection.items?.length
      refIds = collection.items.map (item) -> getIdForItemData(item.data)
      refIds = refIds.filter (id) -> id?

      if refIds?
        unless Array.isArray(refIds)
          refIds = [refIds]
        if refIds.length
          eventData = {
            method: method,
            collection: collection.rel,
            refIds: refIds
          }
    return eventData
  if Array.isArray(data)
    # loop over collections in array
    data.forEach (response) ->
      # if items exist, return event for each item
      # (this shouldn't really happen very often)
      eventData = buildEventDataFromCollection(response.collection)
      emit(eventData) if eventData
  else if data.collection.rel is 'bulk_load'
    # When bulk_load, group items by collection and emit
    # events for each collection
    collections = {}
    collectionItems = data.collection.items
    if collectionItems?.length
      collectionItems.forEach (item) ->
        itemType = null
        item.data.some (field) ->
          if field.name is 'type'
            itemType = camelize(field.value)
            return true
          else
            return false
        itemCollection = types.getPluralType(itemType)
        unless collections.hasOwnProperty(itemCollection)
          collections[itemCollection] = {
            items: [],
            rel: itemCollection,
          }
        collections[itemCollection].items.push(item)

      Object.keys(collections).forEach (collectionName) ->
        collection = collections[collectionName]

        eventData = buildEventDataFromCollection(collection)
        emit(eventData) if eventData
  else
    eventData = buildEventDataFromCollection(data.collection)
    emit(eventData) if eventData

module.exports = {
  emit: emit,
  requestResponse: requestResponse
}
