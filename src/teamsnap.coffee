promises = require './promises'
{Collection, Item} = require './model'
require './errors'

class TeamSnap
  version: '1.13.0'
  promises: promises
  when: promises.when
  TeamSnap: TeamSnap
  Collection: Collection
  Item: Item

  constructor: (@apiUrl = 'https://apiv3.teamsnap.com',
    @authUrl = 'https://auth.teamsnap.com') ->



module.exports = new TeamSnap()
require './auth'
require './sdk'


unless String::trim
  String::trim = -> @replace /^\s+|\s+$/g, ''
