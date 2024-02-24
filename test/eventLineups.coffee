describe 'EventLineups', ->
  location = null
  event = null
  eventLineup = null

  before (done) ->
    location = teamsnap.createLocation()
    location.name = 'Test Lineup Location'
    location.teamId = team.id
    teamsnap.saveLocation location, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'location')
      done()

  before (done) ->
    event = teamsnap.createEvent()
    event.name = 'Test Lineup Event'
    event.teamId = team.id
    event.locationId = location.id
    event.startDate = new Date()
    teamsnap.saveEvent event, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'event')
      done() 
  
  after (done) ->
    teamsnap.deleteEvent event, (err, result) ->
      expect(err).to.be.null
      done()
  
  after (done) ->
    teamsnap.deleteLocation location, (err, result) ->
      expect(err).to.be.null
      done()

  it 'should be able to load all eventLineups for event', (done) ->
    teamsnap.loadEventLineups event.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to create eventLineup for event', (done) ->
    eventLineup = teamsnap.createEventLineup({eventId: event.id})
    teamsnap.saveEventLineup eventLineup, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'eventLineup')
      done()

  it 'should be able to delete a eventLineup', (done) ->
    teamsnap.deleteEventLineup eventLineup, (err, result) ->
      expect(err).to.be.null
      done()