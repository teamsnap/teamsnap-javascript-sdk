teamsnap = exports

types = [
  'user'
  'assignment'
  'availability'
  'broadcastEmail'
  'broadcastSms'
  'contact'
  'contactEmailAddress'
  'contactPhoneNumber'
  'customDatum'
  'customField'
  'leagueCustomDatum'
  'leagueCustomField'
  'divisionLocation'
  'divisionMember'
  'divisionMemberPreferences'
  'divisionTeamStanding'
  'event'
  'forumPost'
  'forumSubscription'
  'forumTopic'
  'leagueRegistrantDocument'
  'location'
  'member'
  'memberEmailAddress'
  'memberFile'
  'memberLink'
  'memberPayment'
  'memberPhoneNumber'
  'memberPreferences'
  'memberStatistic'
  'opponent'
  'opponentResults'
  'paymentNote'
  'plan'
  'smsGateway'
  'sponsor'
  'statistic'
  'statisticDatum'
  'statisticGroup'
  'sport'
  'team'
  'teamFee'
  'teamPaypalPreferences'
  'teamPreferences'
  'teamPublicSite'
  'teamResults'
  'teamStatistic'
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
  broadcastSms: 'broadcastSmses'
  memberPreferences: 'membersPreferences'
  divisionMemberPreferences: 'divisionMembersPreferences'
  opponentResults: 'opponentsResults'
  statisticDatum: 'statisticData'
  teamPaypalPreferences: 'teamsPaypalPreferences'
  teamPreferences: 'teamsPreferences'
  teamResults: 'teamsResults'
  customDatum: 'customData'
  leagueCustomDatum: 'leagueCustomData'
  smsGateway: 'smsGateways'

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
