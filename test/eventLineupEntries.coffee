describe 'EventLineupEntries', ->
  location = null
  event = null
  eventLineup = null
  member = null
  eventLineupEntry = null

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
  
  before (done) ->
    member = teamsnap.createMember()
    member.teamId = team.id
    member.firstName = 'Test'
    teamsnap.saveMember member, (err, result) ->
      expect(err).to.be.null
      done()
  
  before (done) ->
    eventLineup = teamsnap.createEventLineup({eventId: event.id})
    teamsnap.saveEventLineup eventLineup, (err, result) ->
      expect(err).to.be.null
      done()  
    
  after (done) ->
    teamsnap.deleteEventLineup eventLineup, (err, result) ->
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

  after (done) ->
    teamsnap.deleteMember member, (err, result) ->
      expect(err).to.be.null
      done()
    
  it 'should be able to create and save eventLineupEntry for eventLineup', (done) ->
    eventLineupEntry = teamsnap.createEventLineupEntry()
    eventLineupEntry.eventLineupId = eventLineup.id
    eventLineupEntry.memberId = member.id
    teamsnap.saveEventLineupEntry eventLineupEntry, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'eventLineupEntry')
      done()

  it 'should be able to delete eventLineupEntry', (done) ->
    teamsnap.deleteEventLineupEntry eventLineupEntry, (err, result) ->
      expect(err).to.be.null
      done()
