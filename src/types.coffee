teamsnap = exports

types = [
  'user'
  'actionLog'
  'advertisement'
  'assignment'
  'availability'
  'batchInvoice'
  'batchInvoiceLineItem'
  'broadcastAlert'
  'broadcastEmail'
  'broadcastEmailAttachment'
  'contact'
  'contactEmailAddress'
  'contactPhoneNumber'
  'customDatum'
  'customField'
  'divisionAggregate'
  'leagueCustomDatum'
  'leagueCustomField'
  'divisionContact'
  'divisionContactEmailAddress'
  'divisionContactPhoneNumber'
  'divisionEvent'
  'divisionLocation'
  'divisionMember'
  'divisionMemberEmailAddress'
  'divisionMemberPhoneNumber'
  'divisionMemberPreferences'
  'divisionStore'
  'divisionTeamStanding'
  'divisionPreferences'
  'division'
  'event'
  'eventStatistic'
  'forecast'
  'forumPost'
  'forumSubscription'
  'forumTopic'
  'leagueRegistrantDocument'
  'invoice'
  'invoiceLineItem'
  'invoiceTransaction'
  'location'
  'member'
  'memberAssignment'
  'memberBalance'
  'memberEmailAddress'
  'memberFile'
  'memberLink'
  'memberPayment'
  'memberPhoneNumber'
  'memberPhoto'
  'memberPreferences'
  'memberStatistic'
  'memberRegistrationSignup'
  'message'
  'messageDatum'
  'opponent'
  'opponentResults'
  'partnerPreferences'
  'partnerUserPreferences'
  'paymentNote'
  'plan'
  'registrationForm'
  'registrationFormLineItemOption'
  'registrationFormLineItem'
  'smsGateway'
  'sponsor'
  'statistic'
  'statisticAggregate'
  'statisticDatum'
  'statisticGroup'
  'sport'
  'team'
  'teamFee'
  'teamMedium'
  'teamMediumComment'
  'teamMediaGroup'
  'teamName'
  'teamPaypalPreferences'
  'teamPhoto'
  'teamPreferences'
  'teamPublicSite'
  'teamResults'
  'teamStatistic'
  'teamStore'
  'timeZone'
  'trackedItem'
  'trackedItemStatus'
]

teamTypes = types.slice()
teamTypes.remove = (type) ->
  index = @indexOf(type)
  @splice(index, 1) unless index is -1
  this

teamTypes
  .remove('user')
  .remove('plan')
  .remove('smsGateway')
  .remove('sport')
  .remove('timeZone')

# create lookup hashes
typeLookup = {}
singularLookup = {}
# pre-define exceptions
pluralLookup =
  memberPreferences: 'membersPreferences'
  divisionMemberPreferences: 'divisionMembersPreferences'
  divisionPreferences: 'divisionsPreferences'
  opponentResults: 'opponentsResults'
  partnerPreferences: 'partnersPreferences'
  statisticDatum: 'statisticData'
  messageDatum: 'messageData'
  teamMedium: 'teamMedia'
  teamPaypalPreferences: 'teamsPaypalPreferences'
  teamPreferences: 'teamsPreferences'
  teamResults: 'teamsResults'
  customDatum: 'customData'
  leagueCustomDatum: 'leagueCustomData'
  smsGateway: 'smsGateways'
  partnerUserPreferences: 'partnersUserPreferences'

for type in types
  plural = pluralLookup[type] or switch type.slice -1
    when 'y' then type.slice(0, -1) + 'ies'
    when 's' then type + 'es'
    else type + 's'
  typeLookup[type] = type
  typeLookup[plural] = type
  singularLookup[plural] = type
  pluralLookup[type] = plural


# check if the name is the plural version or singular version (singularLookup
# translates from non-singular to singular, so if it exists there, it's plural)
teamsnap.isPluralType = (name) -> singularLookup.hasOwnProperty(name)
teamsnap.isSingularType = (name) -> pluralLookup.hasOwnProperty(name)

teamsnap.hasType = (type) -> typeLookup[type] isnt undefined
teamsnap.getTypes = -> types.slice()
teamsnap.getTeamTypes = -> teamTypes.slice()
teamsnap.getPluralType = (name) -> pluralLookup[name]
teamsnap.getSingularType = (name) -> singularLookup[name]
teamsnap.getType = (name) -> typeLookup[name]
teamsnap.camelcaseType = (type) ->
  type.replace /[-_]+(\w)/g, (_, char) ->
    char.toUpperCase()
teamsnap.underscoreType = (type) ->
  type.replace /[A-Z]/g, (char) ->
    '_' + char.toLowerCase()
