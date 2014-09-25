teamsnap = exports

types = [
  'user'
  'assignment'
  'availability'
  'contact'
  'contactEmailAddress'
  'contactPhoneNumber'
  'customDatum'
  'customField'
  'event'
  'location'
  'member'
  'memberEmailAddress'
  'memberLink'
  'memberPhoneNumber'
  'memberPreferences'
  'opponent'
  'plan'
  'sport'
  'team'
  'teamPreferences'
  'teamPublicSite'
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
  .remove('sport')

# create lookup hashes
typeLookup = {}
singularLookup = {}
# pre-define exceptions
pluralLookup =
  memberPreferences: 'membersPreferences'
  teamPreferences: 'teamsPreferences'
  customDatum: 'customData'

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
