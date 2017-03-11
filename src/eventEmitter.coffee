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

requestResponse = (method, xhr) =>
  return if method is 'get'
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

  else
    eventData = buildEventDataFromCollection(data.collection)
    emit(eventData) if eventData

module.exports = {
  emit: emit,
  requestResponse: requestResponse
}
