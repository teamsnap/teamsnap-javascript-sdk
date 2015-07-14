describe 'Statistic Data', ->

  member = null
  location = null
  event = null
  statistic = null
  statisticDatum = null
  bulkStatistic = null
  bulkStatisticDatum = null

  before (done) ->
    member = teamsnap.createMember()
    member.firstName = 'Esdee'
    member.lastName = 'Kay'
    member.teamId = team.id
    teamsnap.saveMember member, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'member')
      done()

  before (done) ->
    location = teamsnap.createLocation()
    location.name = 'Test Statistic Location'
    location.teamId = team.id
    teamsnap.saveLocation location, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'location')
      done()

  before (done) ->
    event = teamsnap.createEvent()
    event.name = 'Test Statistic Event'
    event.teamId = team.id
    event.locationId = location.id
    event.startDate = new Date()
    teamsnap.saveEvent event, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'event')
      done()

  before (done) ->
    statistic = teamsnap.createStatistic()
    statistic.name = 'Test Statistic'
    statistic.acronym = 'TST'
    statistic.teamId = team.id
    teamsnap.saveStatistic statistic, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'statistic')
      done()

  before (done) ->
    bulkStatistic = teamsnap.createStatistic()
    bulkStatistic.name = 'Test Bulk Statistic'
    bulkStatistic.acronym = 'TSTB'
    bulkStatistic.teamId = team.id
    teamsnap.saveStatistic bulkStatistic, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'statistic')
      done()

  after (done) ->
    teamsnap.deleteStatistic statistic, (err, result) ->
      expect(err).to.be.null
      done()

  after (done) ->
    teamsnap.deleteStatistic bulkStatistic, (err, result) ->
      expect(err).to.be.null
      done()

  after (done) ->
    teamsnap.deleteEvent event, (err, result) ->
      expect(err).to.be.null
      done()

  after (done) ->
    teamsnap.deleteLocation location, (err, result) ->
      expect(err).to.be.null
      done()


  it 'should be able to create a member statistic datum', (done) ->
    statisticDatum = teamsnap.createStatisticDatum()
    statisticDatum.teamId = team.id
    statisticDatum.statisticId = statistic.id
    statisticDatum.eventId = event.id
    teamsnap.saveStatisticDatum statisticDatum, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'statisticDatum')
      done()

  it 'should be able to bulk save member statistic data', (done) ->
    bulkStatisticDatum = teamsnap.createStatisticDatum()
    bulkStatisticDatum.teamId = team.id
    bulkStatisticDatum.statisticId = bulkStatistic.id
    bulkStatisticDatum.eventId = event.id
    templates = []
    clonedTemplate =
    JSON.parse(JSON.stringify(teamsnap.collections.statisticData.template))
    clonedTemplate.forEach (field) ->
      camelizedFieldName = field.name.
      replace(/(\_\w)/g, (m) -> return m[1].toUpperCase())
      field.value = statisticDatum[camelizedFieldName]
    templates.push {data: clonedTemplate}
    teamsnap.bulkSaveStatisticData JSON.stringify(templates), (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()


  it 'should be able to load all team statistic data', (done) ->
    teamsnap.loadStatisticData team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to delete a statistic datum', (done) ->
    teamsnap.deleteStatisticDatum statisticDatum, (err, result) ->
      expect(err).to.be.null
      done()

  it 'should be able to bulk delete statistic data', (done) ->
    teamsnap.bulkDeleteStatisticData member, event, (err, result) ->
      expect(err).to.be.null
      done()
