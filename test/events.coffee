describe 'Events', ->

  member = null
  location = null

  before (done) ->
    location = teamsnap.createLocation()
    location.teamId = team.id
    location.name = "Location"
    teamsnap.saveLocation location, (err, result) ->
      done()

  before (done) ->
    member = teamsnap.createMember()
    member.teamId = team.id
    member.firstName = 'Test'
    teamsnap.saveMember member, (err, result) ->
      done()

  after (done) ->
    teamsnap.deleteMember member, (err, result) ->
      expect(err).to.be.null
      done()

  it 'should be able to load all events for team', (done) ->
    teamsnap.loadEvents team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to bulk create events', (done) ->
    events = [
      {
        startDate: "2012-01-01",
        name: "Test",
        teamId: team.id,
        locationId: location.id
      }
    ]

    params = {
      events: events,
      teamId: team.id,
      sendingMemberId: member.id,
      notifyTeam: false
    }

    teamsnap.bulkCreateEvents params, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()