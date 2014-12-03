teamsnap = require './teamsnap'
promises = require './promises'
loadCollections = require './loadCollections'
{ Item, ScopedCollection } = require './model'
urlExp = /^https?:\/\//


module.exports = (request, cachedCollections, version, callback) ->
  if typeof cachedCollections is 'function'
    callback = cachedCollections
    cachedCollections = null
  if cachedCollections?.version isnt version
    cachedCollections = null
  
  loadCollections(request, cachedCollections).then((collections) ->
    sdk = createSDKObject(request, collections, version)
    sdk.plans = Item.fromArray(request, collections.plans.items)
    sdk.smsGateways = Item.fromArray(request, collections.smsGateways.items)
    sdk.sports = Item.fromArray(request, collections.sports.items)
    sdk.timeZones = Item.fromArray(request, collections.timeZones.items)
    sdk
  ).callback callback



createSDKObject = (request, collections, version) ->
  scopedCollections = {}
  Object.keys(collections).forEach (name) ->
    collection = collections[name]
    scopedCollections[name] = new ScopedCollection request, collection
  
  sdk =
    version: version
    when: promises.when
    request: request
    collections: scopedCollections

    # Utility methods for loading, creating, saving, and deleting items
    loadItems: (type, params, callback) ->
      unless @hasType type
        throw new TSArgsError 'teamsnap.load*', 'must provide a valid `type`'
      collection = @getCollectionForItem type
      collection.queryItems 'search', params, callback
    

    loadItem: (type, params, callback) ->
      unless @hasType type
        throw new TSArgsError 'teamsnap.load*', 'must provide a valid `type`'
      collection = @getCollectionForItem type
      collection.queryItem 'search', params, callback


    createItem: (properties, defaults) ->
      unless properties
        properties = defaults
        defaults = null
      if defaults
        properties = mergeDefaults(properties, defaults)
      unless @isItem properties
        throw new TSArgsError 'teamsnap.create*', 'must include a valid `type`'
      unless properties.links
        collection = @getCollectionForItem properties.type
        properties.links = collection.links.cloneEmpty()
      Item.create @request, properties


    saveItem: (item, callback) ->
      unless @isItem item
        throw new TSArgsError 'teamsnap.save*', 'must include a valid `type`'
      collection = @getCollectionForItem item
      collection.save item, callback


    deleteItem: (item, params, callback) ->
      if typeof item is 'string' and urlExp.test item
        item = href: item
      unless typeof item?.href is 'string' and urlExp.test item.href
        throw new TSArgsError 'teamsnap.delete*', 'item must have a valid href
          to delete'

      item = Item.create(@request, item) unless item instanceof Item
      item.delete params, callback


    copyItem: (item) ->
      collection = @getCollectionForItem item
      item.copy(collection.template)


    getNameSort: ->
      (itemA, itemB) ->
        if itemA.type isnt itemB.type
          valueA = itemA.type
          valueB = itemB.type
        else if typeof itemA.name is 'string' and typeof itemB.name is 'string'
          valueA = itemA.name.toLowerCase()
          valueB = itemB.name.toLowerCase()
        else
          if itemA.createdAt and itemB.createdAt
            valueA = itemA.createdAt
            valueB = itemB.createdAt
          else
            valueA = itemA.id
            valueB = itemB.id
        if valueA is valueB then 0
        else if !valueA and valueB then 1
        else if valueA and !valueB then -1
        else if valueA > valueB then 1
        else if valueA < valueB then -1
        else 0


    getDefaultSort: ->
      (itemA, itemB) ->
        if itemA.type isnt itemB.type
          valueA = itemA.type
          valueB = itemB.type
        else
          if itemA.createdAt and itemB.createdAt
            valueA = itemA.createdAt
            valueB = itemB.createdAt
          else
            valueA = itemA.id
            valueB = itemB.id
        if valueA is valueB then 0
        else if !valueA and valueB then 1
        else if valueA and !valueB then -1
        else if valueA > valueB then 1
        else if valueA < valueB then -1
        else 0


    getCollectionForItem: (item) ->
      type = if typeof item is 'string' then item else item.type
      collectionName = @getPluralType type
      @collections[collectionName]

    # Helpers
    isId: (value) ->
      typeof value is 'string' or typeof value is 'number'

    isItem: (value, type) ->
      @hasType(value?.type) and (not type or value.type is type)

    reject: (msg, field, callback) ->
      promises.reject(new TSValidationError msg, field).callback callback


  add = (module) ->
    for key, value of module
      sdk[key] = value

  add require './types'
  
  # Only add these two methods from linking
  linking = require './linking'
  sdk.linkItems = linking.linkItems
  sdk.unlinkItems = linking.unlinkItems

  add require './persistence'
  add require './collections/teams'
  add require './collections/assignments'
  add require './collections/availabilities'
  add require './collections/contactEmailAddresses'
  add require './collections/contactPhoneNumbers'
  add require './collections/contacts'
  add require './collections/customData'
  add require './collections/customFields'
  add require './collections/events'
  add require './collections/locations'
  add require './collections/memberEmailAddresses'
  add require './collections/memberFiles'
  add require './collections/memberLinks'
  add require './collections/memberPhoneNumbers'
  add require './collections/memberPreferences'
  add require './collections/members'
  add require './collections/opponents'
  add require './collections/plans'
  add require './collections/sponsors'
  add require './collections/sports'
  add require './collections/teamPreferences'
  add require './collections/teamPublicSites'
  add require './collections/teamResults'
  add require './collections/trackedItems'
  add require './collections/trackedItemStatuses'
  add require './collections/users'
  sdk


mergeDefaults = (properties, defaults) ->
  obj = {}
  for own key, value of properties
    unless typeof value is 'function' or key.charAt(0) is '_'
      obj[key] = value
  for own key, value of defaults
    unless typeof value is 'function' or properties.hasOwnProperty key
      obj[key] = value
  obj
