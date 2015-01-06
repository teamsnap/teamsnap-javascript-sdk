promises = require './promises'
types = require './types'
{ Collection } = require './model'

# Load the root teamsnap collections just once
collectionsPromise = null

# First time loads from cache or server, after that returns resolved promise
module.exports = (request, cachedCollections) ->
  # Loads all collections for the TeamSnap API once
  if not collectionsPromise or collectionsPromise.getStatus() is 'reject'
    collectionsPromise = request.get(teamsnap.apiUrl).then (xhr) ->
      collections = {}
      collections.root = root = Collection.fromData xhr.data
      
      # Ensure the version hasn't changed, reload it if has
      if cachedCollections and cachedCollections.root.version is root.version
        collections = {}
        for key, value of cachedCollections
          collections[key] = new Collection(value)
        collectionsPromise = promises.resolve collections
      else
        loads = []
        types.getTypes().forEach (type) ->
          rel = types.getPluralType type
          if root.links.has rel
            loads.push request.get(root.links.href rel).then (xhr) ->
              collections[rel] = Collection.fromData xhr.data

        promises.when(loads...).then ->
          collections

  collectionsPromise

module.exports.clear = ->
  collectionsPromise = null