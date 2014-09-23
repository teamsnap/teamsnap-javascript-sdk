# Provides a method for enabling persistence which will associate all items
# loaded and keep only one copy of each item in memory even if it may be loaded
# multiple times. This makes working with a team's data in-memory very easy. To
# "unload" an item or list of items from memory after enabling persistence, use
# disassociateItems and they'll be removed.
promises = require './promises'
linking = require './linking'
types = require './types'
{ ScopedCollection, Item, MetaList } = require './model'

lookup = null


# Enables persistence: storing all loaded items and associating them, keeping
# only one copy of each item in memory, automatically disassociating items when
# deleted, and allowing items to be reset to their saved state on demand.
exports.enablePersistence = ->
  return if lookup # already enabled
  @persistenceEnabled = true
  lookup = {}
  modifyModel()
  modifySDK(this)


# Turns off persistence and disassociates all items currently persisted to allow
# for garbage collection
exports.disablePersistence = ->
  return unless lookup
  @persistenceEnabled = false
  lookup = null
  linking.unlinkItems (Object.keys(lookup).map (href) -> lookup[href]), lookup
  revertModel()
  revertSDK(this)


exports.findItem = (href) ->
  lookup?[href]



modifyModel = ->
  # Hook into link loading to link items
  wrapMethod MetaList.prototype, '_request', (_request) ->
    (request, method, rel, params, type) ->
      _request.call(this, request, method, rel, params, type).then (items) ->
        if Array.isArray items
          linking.linkItems(items, lookup)
          items.forEach (item) -> item.saveState()
          items

  # Hook into ScopedCollection.save to register/update saved items
  wrapMethod ScopedCollection.prototype, 'save', (save) ->
    (item, callback) ->
      save.call(this, item).then((item) ->
        if Array.isArray item
          item.map (item) ->
            linking.linkItem(item, lookup)
            item.saveState()
        else
          linking.linkItem(item, lookup)
          item.saveState()
      ).callback callback

  # Hook into Item.delete to unregister deleted items or remove if not saved
  wrapMethod Item.prototype, 'delete', (deleteItem) ->
    (params, callback) ->
      item = this
      linking.unlinkItem item, lookup
      deleteItem.call(this, params).fail((err) ->
        linking.linkItem item, lookup
        err
      ).callback callback

  # Hook into Item.create to register items being serialized from a cache.
  wrapMethod Item, 'create', (create) ->
    (request, data) ->
      item = create.call(this, request, data)
      linking.linkItem(item, lookup) if item.href
      item

  # Hook into item.deserialize to only ever return one copy of an item
  wrapMethod Item.prototype, 'deserialize', (deserialize) ->
    (data) ->
      data = data.collection.items?[0] if data?.collection
      item = lookup[data.href] or this
      deserialize.call(item, data)

  # Hook into item.serialize to only save changed fields when updating
  wrapMethod Item.prototype, 'serialize', (serialize) ->
    (template) ->
      body = serialize.call(this, template)
      if (state = @_state)
        body.template.data = body.template.data.filter (field) ->
          oldValue = state[camelize field.name]
          value = field.value
          isSame =
            value is oldValue or
            (value and oldValue and value.valueOf() is oldValue.valueOf())
          not isSame
      body

  # Save an item's current state, probably shouldn't be used explicitly
  Item::saveState = ->
    @_state = { _undos: [] }
    copy(this, @_state) if @href
    this

  # Rolls an item back to its last saved state, use if a user "cancels" changes
  Item::rollback = ->
    @_state._undos.reverse().forEach (undo) -> undo()
    @_state._undos.length = 0
    copy(@_state, this)

  # Links an item with another before save, including setting the foreign id on
  # the item. `item.rollback()` will undo links made before a save.
  Item::link = (rel, item) ->
    @saveState() unless @_state
    undos = @_state._undos
    if @[rel]
      related = @[rel]
      linking.unlinkItemFrom(this, @[rel])
      undos.push =>
        @[rel + 'Id'] = related.id
        linking.linkItemWith(this, related)
    @[rel] = item
    if item
      @[rel + 'Id'] = item.id
      linking.linkItemWith(this, item)
      undos.push =>
        delete @[rel + 'Id']
        linking.unlinkItemFrom(this, item)
    this


revertModel = ->
  revertWrapMethod MetaList.prototype, '_request'
  revertWrapMethod ScopedCollection.prototype, 'save'
  revertWrapMethod Item.prototype, 'delete'
  revertWrapMethod Item, 'create'
  revertWrapMethod Item.prototype, 'deserialize'
  revertWrapMethod Item.prototype, 'serialize'
  delete Item::saveState
  delete Item::rollback
  delete Item::link



modifySDK = (sdk) ->
  # 1. saveMember needs to load avails and trackedItemStatuses when new
  # 2. deleteMember needs to remove avails, trackedItemStatuses, assignments,
  # emails, phones, contacts, contact emails, and contact phones
  # 2. deleteContact needs to remove emails and phones
  # 3. saveEvent needs to load avails when new
  # 4. deleteEvent needs to remove avails and assignments
  # 7. deleteEvent needs to remove other events when using include
  # 5. saveTrackedItem needs to load trackedItemStatuses when new
  # 6. deleteTrackedItem needs to remove trackedItemStatuses
  # 8. deleteTeam needs to remove all related data except plan and sport

  # Load the availabilities and trackedItemStatuses for the new member
  wrapSaveForNew sdk, 'saveMember', (member) ->
    promises.when(
      sdk.loadAvailabilities memberId: member.id
      sdk.loadTrackedItemStatuses memberId: member.id
      sdk.loadCustomData memberId: member.id
    )

  # Remove related records when a member is deleted
  wrapMethod sdk, 'deleteMember', (deleteMember) ->
    (member, callback) ->
      toRemove = []
      toRemove.push member.assignments...
      toRemove.push member.availabilities...
      member.contacts.forEach (contact) ->
        toRemove.push contact.contactEmailAddresses...
        toRemove.push contact.contactPhoneNumbers...
        toRemove.push contact
      toRemove.push member.trackedItemStatuses...

      deleteMember.call(this, member, callback).then((result) ->
        linking.unlinkItems toRemove, lookup
        result
      ).callback callback

  # Remove related records when a contact is deleted
  wrapMethod sdk, 'deleteContact', (deleteContact) ->
    (contact, callback) ->
      toRemove = []
      toRemove.push contact.contactEmailAddresses...
      toRemove.push contact.contactPhoneNumbers...

      deleteContact.call(this, contact, callback).then((result) ->
        linking.unlinkItems toRemove, lookup
        result
      ).callback callback

  # Load availabilities for the new event
  wrapSaveForNew sdk, 'saveEvent', (event) ->
    sdk.loadAvailabilities eventId: event.id

  # Remove related records (including repeating events) when an event(s) are
  # deleted
  wrapMethod sdk, 'deleteEvent', (deleteEvent) ->
    (event, include, callback) ->
      events = [] # additional events and items to remove

      # Add all events being deleted
      if typeof include is 'string' and include isnt sdk.EVENTS.NONE
        uuid = event.repeatingUuid
        startDate = event.startDate

        event.team?.events?.forEach (event) ->
          events.push(event) if event.repeatingUuid is uuid
        
        if include is sdk.EVENTS.FUTURE
          events = events.filter (event) ->
            event.startDate >= startDate
      else
        events.push event

      # Add all items (events, assignments, and availabilities) to remove
      toRemove = events.slice()
      events.forEach (event) ->
        toRemove.push event.assignments...
        toRemove.push event.availabilities...

      linking.unlinkItems toRemove, lookup
      deleteEvent.call(this, event, include, callback).fail((err) ->
        linking.linkItems toRemove, lookup
        err
      ).callback callback

  # Load the tracked item statuses for the new tracked item
  wrapSaveForNew sdk, 'saveTrackedItem', (trackedItem) ->
    sdk.loadTrackedItemStatuses trackedItemId: trackedItem.id

  # Remove tracked item statuses when a tracked item is deleted
  wrapMethod sdk, 'deleteTrackedItem', (deleteTrackedItem) ->
    (trackedItem, callback) ->
      toRemove = trackedItem.trackedItemStatuses.slice()
      deleteTrackedItem.call(this, trackedItem).then((result) ->
        linking.unlinkItems toRemove, lookup
        result
      ).callback callback

  # Remove all records belonging to a team when it is deleted
  wrapMethod sdk, 'deleteTeam', (deleteTeam) ->
    (team, callback) ->
      toRemove = []
      team.links.each (rel) ->
        value = team[name]
        if types.getType(rel) and rel isnt 'sport' and rel isnt 'plan'
          if Array.isArray value
            toRemove.push(value...)
          else
            toRemove.push(value)
      deleteTeam.call(this, team).then((result) ->
        linking.unlinkItems toRemove, lookup
        result
      ).callback callback



revertSDK = (sdk) ->
  revertWrapMethod sdk, 'saveMember'
  revertWrapMethod sdk, 'deleteMember'
  revertWrapMethod sdk, 'deleteContact'
  revertWrapMethod sdk, 'saveEvent'
  revertWrapMethod sdk, 'deleteEvent'
  revertWrapMethod sdk, 'saveTrackedItem'
  revertWrapMethod sdk, 'deleteTrackedItem'
  revertWrapMethod sdk, 'deleteTeam'




# Replace a method with a new one, providing it for calling
wrapMethod = (obj, methodName, newMethodProvider) ->
  oldMethod = obj[methodName]
  obj[methodName] = newMethodProvider oldMethod
  obj[methodName].oldMethod = oldMethod
  obj

# Revert a wrapMethod that was called earlier
revertWrapMethod = (obj, methodName) ->
  oldMethod = obj[methodName].oldMethod
  obj[methodName] = oldMethod

# Wraps an SDK save call to do extra work after a save is complete
wrapSaveForNew = (sdk, saveMethodName, onSave) ->
  wrapMethod sdk, saveMethodName, (save) ->
    (item, callback) ->
      if item.id
        save.call(this, item, callback)
      else
        savedItem = null
        save.call(this, item)
          .then((item) -> savedItem = item)
          .then(onSave)
          .then(-> savedItem)
          .callback callback


copy = (from, to) ->
  Object.keys(from).forEach (key) ->
    return if typeof value is 'function' or key.charAt(0) is '_'
    to[key] = from[key]
  to

camelize = (str) ->
  str.replace /[-_]+(\w)/g, (_, char) ->
    char.toUpperCase()
