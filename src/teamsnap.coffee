promises = require './promises'
{Collection, Item} = require './model'
require './errors'

class TeamSnap
  version: '1.58.0'
  promises: promises
  when: promises.when
  TeamSnap: TeamSnap
  Collection: Collection
  Item: Item

  constructor: (@apiUrl = 'https://apiv3.teamsnap.com',
    @authUrl = 'https://auth.teamsnap.com',
    @accountsUrl = 'https://accounts.teamsnap.com') ->

  # -- BETA -- #
  # Subject to change, and not
  # recommended for production use
  useEventEmitter: false
  # ---------- #


module.exports = new TeamSnap()
require './auth'
require './sdk'


unless String::trim
  String::trim = -> @replace /^\s+|\s+$/g, ''
