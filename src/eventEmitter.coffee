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

buildEventDataFromCollection = (collection, method, refIds) ->
  eventData = null

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

emit = (data, eventType = 'event') ->
  eventName = 'teamsnap-sdk-' + eventType
  eventFactory(eventName, data)

requestBuilder = (requestId, method, url, data, error) ->
  eventName = 'request-start'
  if error?
    eventName = 'request-error'

  urlParts = url.split('/')
  lastUrlPart = urlParts[urlParts.length - 1]

  if method.toUpperCase() is 'DELETE'
    # Since `DELETE` requests have no response body, we need to get the
    # collection / id from the request URL.
    id = parseInt(urlParts[urlParts.length - 1])
    collection = urlParts[urlParts.length - 2]

    eventData = {
      requestId: requestId,
      method: method,
      collection: collection,
      data: {
        id: id
      }
    }

    eventData.error = error if error?

    emit(eventData, eventName)

  else if lastUrlPart is 'search'
    types = data.types

    types.forEach (type) ->
      eventData = {
        requestId: requestId,
        method: method,
        collection: urlParts[urlParts.length - 2],
        data: data
      }

      eventData.error = error if error?

      emit(eventData, eventName)

  else
    type = types.getSingularType(lastUrlPart)
    # is this a valid collection?
    if type
      eventData = {
        requestId: requestId,
        method: method,
        collection: lastUrlPart,
        data: data
      }

      eventData.error = error if error?

    emit(eventData, eventName)

## -- REQUEST START -- ##
requestStart = (requestId, method, url, data) ->
  requestBuilder(requestId, method, url, data)

## -- REQUEST ERROR -- ##
requestError = (requestId, method, url, data, error) ->
  requestBuilder(requestId, method, url, data, error)

## -- REQUEST RESPONSE -- ##
requestResponse = (requestId, method, xhr) ->
  data = xhr.data
  eventData = null

  if method.toUpperCase() is 'DELETE'
    # Since `DELETE` requests have no response body, we need to get the
    # collection / id from the request URL.
    urlParts = xhr.responseURL.split('/')
    refIds = [parseInt(urlParts[urlParts.length - 1])]
    collection = urlParts[urlParts.length - 2]

    type = types.getSingularType(collection)
    # is this a valid collection?
    if type
      eventData = {
        requestId: requestId,
        method: method,
        collection: collection,
        refIds: refIds,
      }
      emit(eventData, 'request-response')

  else if Array.isArray(data)
    # loop over collections in array
    data.forEach (response) ->
      # if items exist, return event for each item
      # (this shouldn't really happen very often)
      type = types.getSingularType(collection.collection)
      # is this a valid collection?
      if type
        eventData = buildEventDataFromCollection(response.collection, method, refIds)
        if eventData
          eventData.requestId = requestId
          emit(eventData, 'request-response')
  else if data.collection.rel is 'bulk_load'
    # When bulk_load, group items by collection and emit
    # events for each collection
    collections = {}
    collectionItems = data.collection?.items
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
        type = types.getSingularType(collectionName)
        # is this a valid collection?
        if type
          eventData = buildEventDataFromCollection(collection, method, refIds)
          if eventData
            eventData.requestId = requestId
            emit(eventData, 'request-response')
  else
    eventData = buildEventDataFromCollection(data.collection, method, refIds)
    type = types.getSingularType(data.collection)
    # is this a valid collection?
    if type and eventData
      eventData.requestId = requestId
      emit(eventData, 'request-response')

module.exports = {
  emit: emit,
  requestStart: requestStart,
  requestError: requestError,
  requestResponse: requestResponse,
}
