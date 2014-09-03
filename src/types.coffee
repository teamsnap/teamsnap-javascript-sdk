teamsnap = exports

types = [
  'user'
  'availability'
  'contact'
  'event'
  'location'
  'member'
  'memberEmailAddress'
  'memberPhoneNumber'
  'memberPreferences'
  'opponent'
  'plan'
  'refreshment'
  'sport'
  'team'
  'teamPreferences'
  'teamPublicSite'
  'trackedItem'
  'trackedItemStatus'
]

teamTypes = types.slice(1)

# create lookup hashes
typeLookup = {}
singularLookup = {}
# pre-define exceptions
pluralLookup =
  MemberPreferences: 'membersPreferences'
  TeamPreferences: 'teamsPreferences'

for type in types
  singular = type
  plural = pluralLookup[type] or switch singular.slice -1
    when 'y' then singular.slice(0, -1) + 'ies'
    when 's' then singular + 'es'
    else singular + 's'
  typeLookup[singular] = type
  typeLookup[plural] = type
  singularLookup[type] = singular
  singularLookup[plural] = singular
  pluralLookup[type] = plural
  pluralLookup[singular] = plural


# check if the name is the plural version or singular version (singularLookup
# translates from non-singular to singular, so if it exists there, it's plural)
teamsnap.isPluralType = (name) -> singularLookup.hasOwnProperty(name)
teamsnap.isSingularType = (name) -> pluralLookup.hasOwnProperty(name)

teamsnap.hasType = (type) -> typeLookup[type] isnt undefined
teamsnap.getTypes = -> types.slice()
teamsnap.getTeamTypes = -> teamTypes.slice()
teamsnap.getPluralType = (name) -> pluralLookup[name]
teamsnap.getSingularType = (name) -> singularLookup[name]
teamsnap.getRelType = (name) -> typeLookup[name]
teamsnap.camelcaseType = (type) ->
  type.replace /[-_]+(\w)/g, (_, char) ->
    char.toUpperCase()
teamsnap.underscoreType = (type) ->
  type.replace /[A-Z]/g, (char) ->
    '_' + char.toLowerCase()
