describe 'Statistic Data', ->

  location = null
  event = null
  statistic = null
  statisticDatum = null

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

  after (done) ->
    teamsnap.deleteStatistic statistic, (err, result) ->
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
  
  it 'should be able to load all team statistic data', (done) ->
    teamsnap.loadStatisticData team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to create a member statistic datum', (done) ->
    statisticDatum = teamsnap.createStatisticDatum()
    statisticDatum.teamId = team.id
    statisticDatum.statisticId = statistic.id
    statisticDatum.eventId = event.id
    teamsnap.saveStatisticDatum statisticDatum, (err, result) ->
      console.log err
      expect(err).to.be.null
      result.should.have.property('type', 'statisticDatum')
      done()

  it 'should be able to delete a statistic datum', (done) ->
    teamsnap.deleteStatisticDatum statisticDatum, (err, result) ->
      expect(err).to.be.null
      done()