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
        rootTypeToRels = {}
        loads = []
        for own key, value of collections.root.links
          rootTypeToRels[value.href] = key

        # try to load collections from schema
        if collections.root?.links?.schemas?.href
          loads.push request.get(collections.root.links.schemas.href)
          .then (xhr) ->
            xhr.data.forEach (collection) ->
              # have to look up in root to find the link for the rel
              rel = rootTypeToRels[collection.collection.href]
              if rel && rel != "root"
                collections[rel] = Collection.fromData collection
        else
          # fallback if schemas endpoint doesn't have an href
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
