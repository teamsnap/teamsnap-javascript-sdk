# Provides a method for enabling persistence which will associate all items
# loaded and keep only one copy of each item in memory even if it may be loaded
# multiple times. This makes working with a team's data in-memory very easy. To
# "unload" an item or list of items from memory after enabling persistence, use
# disassociateItems and they'll be removed.
promises = require './promises'
linking = require './linking'
types = require './types'
{ Item } = require './model'
{ ScopedCollection, Item, MetaList } = require './model'

lookup = null


# Enables persistence: storing all loaded items and associating them, keeping
# only one copy of each item in memory, automatically disassociating items when
# deleted, and allowing items to be reset to their saved state on demand.
exports.enablePersistence = (cachedItemData) ->
  return if lookup # already enabled
  unless @collections
    throw new TSError 'You must auth() and loadCollections() before enabling
      persistence.'
  @persistenceEnabled = true
  lookup = {}
  modifyModel()
  modifySDK(this)
  initialItems = []
  initialItems.push.apply(initialItems, @plans)
  initialItems.push.apply(initialItems, @smsGateways)
  initialItems.push.apply(initialItems, @sports)
  initialItems.push.apply(initialItems, @timeZones)
  linking.linkItems @plans.concat(@sports), lookup
  if cachedItemData
    Item.fromArray @request, cachedItemData


# Turns off persistence and disassociates all items currently persisted to allow
# for garbage collection
exports.disablePersistence = ->
  return unless lookup
  @persistenceEnabled = false
  linking.unlinkItems (Object.keys(lookup).map (href) -> lookup[href]), lookup
  lookup = null
  revertModel()
  revertSDK(this)
  this


exports.findItem = (href) ->
  lookup?[href]


exports.getAllItems = ->
  Object.keys(lookup).map (href) -> lookup[href]


exports.unlinkTeam = (team) ->
  items = [team]
  users = team.members?.filter((member) -> member.user)
    .map (member) -> member.user

  for teamType in @getTeamTypes()
    plural = @getPluralType(teamType)
    if (value = team[plural]) and value.length
      items.push value...
    else if (value = team[teamType])
      items.push value

  unlinkItems(items)


modifyModel = ->
  # Hook into item creation to link groups of items
  wrapMethod Item, 'fromArray', (fromArray) ->
    (request, array) ->
      items = fromArray.call(this, request, array)
      linking.linkItems(items, lookup).map (item) ->
        item.saveState()

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
      linking.linkItem(item, lookup)
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
          if field.name is 'type'
            value = camelize(value)
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
        @[rel] = related
        @links[rel].href = related.href
        @[rel + 'Id'] = related.id
        linking.linkItemWith(this, related)
    @[rel] = item
    if item
      @[rel + 'Id'] = item.id
      @links[rel].href = item.href
      linking.linkItemWith(this, item)
      undos.push =>
        delete @[rel]
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
  # 4. saveEvent needs to remove events in repeating event series
  # 5. deleteEvent needs to remove avails and assignments
  # 6. deleteEvent needs to remove other events when using include
  # 7. saveTrackedItem needs to load trackedItemStatuses when new
  # 8. deleteTrackedItem needs to remove trackedItemStatuses
  # 9. deleteTeam needs to remove all related data except plan and sport
  # 10. deleteForumTopic needs to delete all related posts
  # 11. memberEmailAddresses need to reload when invite is sent
  # 12. teamFee and memberBalance needs to reload after transaction
  # 13. memberEmailAddresses and contactEmailAddresses need to be reloaded
  # after importMembersFromTeam
  # 14. messages and messageData need to reload after saveBroadcastAlert

  # Load related records when a member is created
  wrapSave sdk, 'saveMember', (member) ->
    promises.when(
      sdk.loadAvailabilities memberId: member.id
      sdk.loadTrackedItemStatuses memberId: member.id
      sdk.loadCustomData memberId: member.id
      sdk.loadLeagueCustomData memberId: member.id
      sdk.loadMemberPayments memberId: member.id
      sdk.loadMemberBalances memberId: member.id
      sdk.loadTeamFees teamId: member.teamId
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
      toRemove.push member.memberPayments...
      toRemove.push member.memberStatistics...
      toRemove.push member.statisticData...

      linking.unlinkItems toRemove, lookup
      deleteMember.call(this, member, callback).then((result) ->
        sdk.loadTeamFees(member.teamId)
        sdk.loadStatisticAggregates(member.teamId)
        return result
        ).fail((err) ->
          linking.linkItems toRemove, lookup
          err
      ).callback callback

  # Remove related records when a contact is deleted
  wrapMethod sdk, 'deleteContact', (deleteContact) ->
    (contact, callback) ->
      toRemove = []
      toRemove.push contact.contactEmailAddresses...
      toRemove.push contact.contactPhoneNumbers...

      linking.unlinkItems toRemove, lookup
      deleteContact.call(this, contact, callback).then((result) ->
        sdk.loadMembers({memberId: contact.memberId}).then -> result
      ).fail((err) ->
        linking.linkItems toRemove, lookup
        err
      ).callback callback

  # Reload member when saving memberEmailAddress
  wrapMethod sdk, 'saveMemberEmailAddress', (saveMemberEmailAddress) ->
    (emailAddress, callback) ->
      saveMemberEmailAddress.call(this, emailAddress, callback).then((result) ->
        sdk.loadMembers({id: emailAddress.memberId}).then -> result
      ).callback callback

  # Reload member when deleting memberEmailAddress
  wrapMethod sdk, 'deleteMemberEmailAddress', (deleteMemberEmailAddress) ->
    (emailAddress, callback) ->
      deleteMemberEmailAddress.call(this, emailAddress, callback)
      .then((result) ->
        sdk.loadMembers({id: emailAddress.memberId}).then -> result
      ).callback callback

  # Reload member when saving memberPhoneNumber
  wrapMethod sdk, 'saveMemberPhoneNumber', (saveMemberPhoneNumber) ->
    (phoneNumber, callback) ->
      saveMemberPhoneNumber.call(this, phoneNumber, callback)
      .then((result) ->
        sdk.loadMembers({id: phoneNumber.memberId}).then -> result
      ).callback callback

  # Reload member when deleting memberPhoneNumber
  wrapMethod sdk, 'deleteMemberPhoneNumber', (deleteMemberPhoneNumber) ->
    (phoneNumber, callback) ->
      deleteMemberPhoneNumber.call(this, phoneNumber, callback)
      .then((result) ->
        sdk.loadMembers({id: phoneNumber.memberId}).then -> result
      ).callback callback

  # Reload member when saving contactEmailAddress
  wrapMethod sdk, 'saveContactEmailAddress', (saveContactEmailAddress) ->
    (emailAddress, callback) ->
      saveContactEmailAddress.call(this, emailAddress, callback)
      .then((result) ->
        sdk.loadMembers({id: emailAddress.memberId}).then -> result
      ).callback callback

  # Reload member when deleting contactEmailAddress
  wrapMethod sdk, 'deleteContactEmailAddress', (deleteContactEmailAddress) ->
    (emailAddress, callback) ->
      deleteContactEmailAddress.call(this, emailAddress, callback)
      .then((result) ->
        sdk.loadMembers({id: emailAddress.memberId}).then -> result
      ).callback callback

  # Reload member when saving contactPhoneNumber
  wrapMethod sdk, 'saveContactPhoneNumber', (saveContactPhoneNumber) ->
    (phoneNumber, callback) ->
      saveContactPhoneNumber.call(this, phoneNumber, callback)
      .then((result) ->
        sdk.loadMembers({id: phoneNumber.memberId}).then -> result
      ).callback callback

  # Reload member when deleting contactPhoneNumber
  wrapMethod sdk, 'deleteContactPhoneNumber', (deleteContactPhoneNumber) ->
    (phoneNumber, callback) ->
      deleteContactPhoneNumber.call(this, phoneNumber, callback)
      .then((result) ->
        sdk.loadMembers({id: phoneNumber.memberId}).then -> result
      ).callback callback

  # Load availabilities for the new event
  # Delete repeating events from series if necessary
  wrapSave sdk, 'saveEvent', (event) ->
    ids = if Array.isArray(event)
      (event.map (event) -> event.id).join(',')
    else
      event.id
    sdk.loadAvailabilities eventId: ids
  , (event) ->
    if event.isGame
      promises.when(
        sdk.loadTeamResults event.teamId
        sdk.loadOpponentResults event.opponentId
        sdk.loadEventStatistics eventId: event.id
      )
    else if Array.isArray(event)
      repeatingEventIds = (e.id for e in event)
      firstEvent = event.shift()
      toRemove = []
      firstEvent.team?.events?.forEach (e) ->
        toRemove.push(e) if e.repeatingUuid is firstEvent.repeatingUuid
      toRemove = toRemove.filter (e) ->
        e.id not in repeatingEventIds
      linking.unlinkItems toRemove, lookup


  # Remove related records (including repeating events) when an event(s) are
  # deleted
  wrapMethod sdk, 'deleteEvent', (deleteEvent) ->
    (event, include, notify, notifyAs, callback) ->
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
        toRemove.push event.eventStatistics...

      linking.unlinkItems toRemove, lookup
      deleteEvent.call(this, event, include, notify, notifyAs, callback)
      .then((result) ->
        if event.isGame
          promises.when(
            sdk.loadTeamResults event.teamId
            sdk.loadOpponentResults event.opponentId
          ).then -> result
        else
          result
      ,(err) ->
        linking.linkItems toRemove, lookup
        err
      ).callback callback

  # Load the tracked item statuses for the new tracked item
  wrapSave sdk, 'saveTrackedItem', (trackedItem) ->
    sdk.loadTrackedItemStatuses trackedItemId: trackedItem.id

  # Remove tracked item statuses when a tracked item is deleted
  wrapMethod sdk, 'deleteTrackedItem', (deleteTrackedItem) ->
    (trackedItem, callback) ->
      toRemove = trackedItem.trackedItemStatuses.slice()

      linking.unlinkItems toRemove, lookup
      deleteTrackedItem.call(this, trackedItem).fail((err) ->
        linking.linkItems toRemove, lookup
        err
      ).callback callback

  # Remove statistic data for related statistic
  wrapMethod sdk, 'deleteStatistic', (deleteStatistic) ->
    (statistic, callback) ->
      toRemove = statistic.statisticData.slice()
      toRemove.push statistic.eventStatistics...
      toRemove.push statistic.memberStatistics...
      toRemove.push statistic.teamStatistics...
      toRemove.push statistic.statisticAggregates...

      linking.unlinkItems toRemove, lookup
      deleteStatistic.call(this, statistic).then((result) ->
        teamId = statistic.teamId
        statisticId = result.id
        bulkLoadTypes = [
          'memberStatistic',
          'teamStatistic',
          'statisticAggregate',
          'eventStatistic'
        ]
        sdk.bulkLoad(teamId, bulkLoadTypes).then -> result
      ).fail((err) ->
        linking.linkItems toRemove, lookup
        err
      ).callback callback

  # Reload statistic data when updating a statistic
  wrapMethod sdk, 'saveStatistic', (saveStatistic) ->
    (statistic, callback) ->
      # Unlink statisticGroup when being removed.
      if not statistic.statisticGroupId? and statistic.statisticGroup?
        linking.unlinkItems statistic.statisticGroup, statistic

      saveStatistic.call(this, statistic, callback).then((result) ->
        teamId = statistic.teamId
        statisticId = result.id
        bulkLoadTypes = [
          'memberStatistic',
          'teamStatistic',
          'statisticAggregate',
          'statistic',
          'statisticGroup',
          'eventStatistic'
        ]

        sdk.bulkLoad(teamId, bulkLoadTypes).then -> result
      ).callback callback

  # Update member statistics when saving statisticData
  wrapMethod sdk, 'bulkSaveStatisticData', (bulkSaveStatisticData) ->
    (templates, callback) ->
      bulkSaveStatisticData.call(this, templates, callback).then((result) ->
        if result[0]? and result[0].teamId?
          teamId = result[0].teamId
          bulkLoadTypes = [
            'memberStatistic',
            'statisticAggregate',
            'eventStatistic'
          ]
          sdk.bulkLoad(teamId, bulkLoadTypes).then -> result
      ).callback callback

  wrapMethod sdk, 'saveStatisticDatum', (saveStatisticDatum) ->
    (statisticDatum, callback) ->
      saveStatisticDatum.call(this, statisticDatum, callback)
      .then((result) ->
        teamId = result.teamId
        statisticId = result.statisticId
        bulkLoadTypes = [
          'memberStatistic',
          'statisticAggregate',
          'eventStatistic'
        ]
        sdk.bulkLoad(teamId, bulkLoadTypes).then -> result
      ).callback callback

  # Remove deleted member statisticData when using bulk delete command
  wrapMethod sdk, 'bulkDeleteStatisticData', (bulkDeleteStatisticData) ->
    (member, event, callback) ->
      toRemove = []
      toRemove.push event.eventStatistics
      member.statisticData?.forEach (statisticDatum) ->
        toRemove.push(statisticDatum) if statisticDatum.event is event

      linking.unlinkItems toRemove, lookup

      bulkDeleteStatisticData.call(this, member, event).then((result) ->
        teamId = member.teamId
        bulkLoadTypes = [
          'memberStatistic',
          'statisticAggregate',
          'eventStatistic'
        ]
        sdk.bulkLoad(teamId, bulkLoadTypes).then -> result
      ).fail((err) ->
        linking.linkItems toRemove, lookup
        err
      ).callback callback

  # Update memberBalance and teamFee when saving memberPayment
  wrapMethod sdk, 'saveMemberPayment', (saveMemberPayment) ->
    (memberPayment, callback) ->
      saveMemberPayment.call(this, memberPayment).then((result) ->
        memberId = result.memberId
        teamFeeId = result.teamFeeId
        promises.when(
          sdk.loadMemberBalances(memberId: memberId)
          sdk.loadTeamFees(id: teamFeeId)
          sdk.loadPaymentNotes(memberPaymentId: memberPayment.id)
        ).then -> result
      ).callback callback


  # Update memberBalances when saving teamFee
  wrapMethod sdk, 'saveTeamFee', (saveTeamFee) ->
    (teamFee, callback) ->
      saveTeamFee.call(this, teamFee).then((result) ->
        teamId = result.teamId
        sdk.loadMemberBalances(teamId: teamId).then ->
          result
      ).callback callback


  # Update memberBalances when deleting teamFee
  wrapMethod sdk, 'deleteTeamFee', (deleteTeamFee) ->
    (teamFee, callback) ->
      deleteTeamFee.call(this, teamFee).then((result) ->
        teamId = teamFee.teamId
        sdk.loadMemberBalances(teamId: teamId).then ->
          result
      ).callback callback


  # Update teamMediaGroups when assigning new media
  wrapMethod sdk, 'assignMediaToGroup', (assignMediaToGroup) ->
    (teamMediumIds, teamMediaGroup, callback) ->
      assignMediaToGroup.call(this, teamMediumIds, teamMediaGroup)
      .then((result) ->
        teamId = result[0].teamId
        bulkLoadTypes = ['teamMediaGroup', 'teamMedium']
        sdk.bulkLoad(teamId, bulkLoadTypes).then -> result
      ).callback callback


  # Update teamPreferences when setting teamMedium as teamPhoto
  wrapMethod sdk, 'setMediumAsTeamPhoto', (setMediumAsTeamPhoto) ->
    (teamMedium, callback) ->
      setMediumAsTeamPhoto.call(this, teamMedium).then((result) ->
        teamId = result.teamId
        sdk.loadTeamPreferences(teamId).then ->
          result
      ).callback callback


  # Update teamPreferences when setting teamMedium as teamPhoto
  wrapMethod sdk, 'setMediumAsMemberPhoto', (setMediumAsMemberPhoto) ->
    (teamMedium, member, callback) ->
      setMediumAsMemberPhoto.call(this, teamMedium, member).then((result) ->
        # Will only work if `member` is an item rather than an id.
        if member.id?
          sdk.loadMembers(id: member.id).then ->
            result
      ).callback callback


  # Reload team to get "storage" used.
  wrapMethod sdk, 'uploadTeamMedium', (uploadTeamMedium) ->
    (teamMedium, progressCallback, callback) ->
      uploadTeamMedium.call(this, teamMedium, progressCallback).then((result) ->
        promises.when(
          sdk.loadTeam teamMedium.teamId
          sdk.loadTeamMediaGroups(id: teamMedium.teamMediaGroupId)
        ).then -> result
      ).callback callback


  # Reload teamMediaGroup when saving teamMedium.
  wrapMethod sdk, 'saveTeamMedium', (saveTeamMedium) ->
    (teamMedium, callback) ->
      teamMediaGroupIds = [teamMedium.teamMediaGroupId]
      # If we're chaning teamMediaGroupId via save.

      unless teamMedium._state?.teamMediaGroupId? is teamMedium.teamMediaGroupId
        teamMediaGroupIds.push teamMedium._state.teamMediaGroupId

      saveTeamMedium.call(this, teamMedium).then((result) ->
        teamId = teamMedium.teamId
        sdk.loadTeamMediaGroups(id: teamMediaGroupIds)
      ).callback callback



  # Reload teamMediaGroup when saving video link.
  wrapMethod sdk, 'saveTeamVideoLink', (saveTeamVideoLink) ->
    (teamMedium, callback) ->
      saveTeamVideoLink.call(this, teamMedium).then((result) ->
        sdk.loadTeamMediaGroups(id: teamMedium.teamMediaGroupId)
      ).callback callback


  # Remove comments when deleting teamMedium, reload team (for file usage quota)
  wrapMethod sdk, 'deleteTeamMedium', (deleteTeamMedium) ->
    (teamMedium, callback) ->
      toRemove = teamMedium.teamMediumComments.slice()

      linking.unlinkItems toRemove, lookup
      deleteTeamMedium.call(this, teamMedium).then((result) ->
        promises.when(
          sdk.loadTeam teamMedium.teamId
          sdk.loadTeamMediaGroups(id: teamMedium.teamMediaGroupId)
        ).then -> result
      ,(err) ->
        linking.linkItems toRemove, lookup
        err
      ).callback callback


  # Note: For the purposes of persistence, this method will accept a teamId,
  # even though it isn't accepted in the actual method.
  wrapMethod sdk, 'bulkDeleteTeamMedia', (bulkDeleteTeamMedia) ->
    (teamMediumIds, teamId, callback) ->
      if typeof teamId is 'function'
        callback = teamId

      bulkDeleteTeamMedia.call(this, teamMediumIds, callback).then((result) ->
        if typeof teamId is 'string' or typeof teamId is 'number'
          promises.when(
            sdk.loadTeam teamId
            sdk.loadTeamMediaGroups(teamId: teamId)
          ).then -> result
        else
          result
      ).callback callback


  # Note: For the purposes of persistence, this method will accept a
  #teamMediaGroupId, even though it isn't accepted in the actual method.
  wrapMethod sdk, 'reorderTeamMedia', (reorderTeamMedia) ->
    (teamId, teamMediaIds, teamMediaGroupId, callback) ->
      params = teamId: teamId
      if typeof teamMediaGroupId is 'function'
        callback = teamMediaGroupId

      if typeof teamMediaGroupId is 'string' or
      typeof teamMediaGroupId is 'number'
        params = id: teamMediaGroupId

      reorderTeamMedia.call(this, teamId, teamMediaIds).then((result) ->
        sdk.loadTeamMediaGroups(params).then -> result
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

  # Remove related posts when a topic is deleted
  wrapMethod sdk, 'deleteForumTopic', (deleteForumTopic) ->
    (topic, callback) ->
      toRemove = []
      toRemove.push topic.forumPosts...

      linking.unlinkItems toRemove, lookup
      deleteForumTopic.call(this, topic, callback).fail((err) ->
        linking.linkItems toRemove, lookup
        err
      ).callback callback

  # Reload memberEmailAddresses when invite is sent
  wrapMethod sdk, 'invite', (invite) ->
    (options, callback) ->
      invite.call(this, options).then((result) ->
        if options.hasOwnProperty('memberId')
          memberId = options.memberId
          sdk.loadMemberEmailAddresses({memberId: memberId}).then -> result
        else if options.hasOwnProperty('contactId')
          contactId = options.contactId
          sdk.loadContactEmailAddresses({contactId: contactId}).then -> result
    ).callback callback


  wrapMethod sdk, 'memberPaymentTransaction', (memberPaymentTransaction) ->
    (memberPaymentId, amount, note, callback) ->
      memberPaymentTransaction.call(this, memberPaymentId, amount, note)
      .then((result) ->
        memberId = result.memberId
        teamFeeId = result.teamFeeId
        promises.when(
          sdk.loadMemberBalances(memberId: memberId)
          sdk.loadTeamFees(id: teamFeeId)
          sdk.loadPaymentNotes(memberPaymentId: memberPaymentId)
        ).then -> result
      ).callback callback

  wrapMethod sdk, 'importMembersFromTeam', (importMembersFromTeam) ->
    (memberIds, teamId, callback) ->
      importMembersFromTeam.call(this, memberIds, teamId)
      .then((result) ->
        memberIds = result.map (member) -> member.id
        promises.when(
          sdk.loadMemberEmailAddresses({memberId: memberIds})
          sdk.loadContactEmailAddresses({memberId: memberIds})
          sdk.loadContacts({memberId: memberIds})
          sdk.loadMemberPhoneNumbers({memberId: memberIds})
          sdk.loadContactPhoneNumbers({memberId: memberIds})
        ).then -> result
      ).callback callback

  wrapMethod sdk, 'saveBroadcastAlert', (saveBroadcastAlert) ->
    (broadcastAlert, callback) ->
      saveBroadcastAlert.call(this, broadcastAlert).then((result) ->
        if result.member?
          params = {memberId: result.memberId}
        else
          params = {contactId: result.contactId}
        sdk.loadMessageData(params)
        sdk.loadMessages({messageSourceId: result.id})
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
wrapSave = (sdk, saveMethodName, onSaveNew, onSaveEdit) ->
  wrapMethod sdk, saveMethodName, (save) ->
    (item, callback) ->
      if item.id and onSaveEdit
        savedItem = null
        save.call(this, item)
          .then((item) -> savedItem = item)
          .then(onSaveEdit)
          .then(-> savedItem)
          .callback callback
      else if not item.id and onSaveNew
        savedItem = null
        save.call(this, item)
          .then((item) -> savedItem = item)
          .then(onSaveNew)
          .then(-> savedItem)
          .callback callback
      else
        save.call(this, item, callback)

copy = (from, to) ->
  Object.keys(from).forEach (key) ->
    return if typeof value is 'function' or key.charAt(0) is '_'
    to[key] = from[key]
  to

camelize = (str) ->
  str.replace /[-_]+(\w)/g, (_, char) ->
    char.toUpperCase()
