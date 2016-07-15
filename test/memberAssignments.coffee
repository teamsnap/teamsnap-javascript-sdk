describe 'Member Assignments', ->

  member = null
  location = null
  event = null
  assignment = null
  memberAssignment = null

  # Create a member
  before (done) ->
    member = teamsnap.createMember()
    member.firstName = 'Esdee'
    member.lastName = 'Kay'
    member.teamId = team.id
    teamsnap.saveMember member, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'member')
      done()

  # Create a location
  before (done) ->
    location = teamsnap.createLocation()
    location.name = 'Test Statistic Location'
    location.teamId = team.id
    teamsnap.saveLocation location, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'location')
      done()

  # Create an event
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

  # Create an assignment
  before (done) ->
    assignment = teamsnap.createAssignment()
    assignment.description = 'Test Assignment'
    assignment.eventId = event.id
    teamsnap.saveAssignment assignment, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'assignment')
      done()

  # Delete assignment
  after (done) ->
    teamsnap.deleteAssignment assignment, (err, result) ->
      expect(err).to.be.null
      done()

  # Delete event
  after (done) ->
    teamsnap.deleteEvent event, (err, result) ->
      expect(err).to.be.null
      done()

  # Delete location
  after (done) ->
    teamsnap.deleteLocation location, (err, result) ->
      expect(err).to.be.null
      done()

  # Delete member
  after (done) ->
    teamsnap.member member, (err, result) ->
      expect(err).to.be.null
      done()

  after (done) ->
    member = null
    location = null
    event = null
    assignment = null
    memberAssignment = null
    done()

  describe 'teamsnap.loadMemberAssignments', ->
    it 'should load an array of member assignments by team id', (done) ->
      teamsnap.loadMemberAssignments team.id, (err, result) ->
        result.should.be.an('array')
        done()

  describe 'teamsnap.createMemberAssignment', (done) ->
    it 'should create an item with type "memberAssignment"', ->
      memberAssignment = teamsnap.createMemberAssignment()
      memberAssignment.should.have.property 'type', 'memberAssignment'
      memberAssignment.memberId = member.id
      memberAssignment.assignmentId = assignment.id
      memberAssignment.teamId = team.id
      done()

  describe 'teamsnap.saveMemberAssignment', ->
    it 'should save a member assignment"', (done) ->
      teamsnap.saveMemberAssignment memberAssignment, (err, result) ->
        expect(err).to.be.null
        done()

  describe 'teamsnap.deleteMemberAssignment', ->
    it 'should delete a member assignment', (done) ->
      teamsnap.deleteMemberAssignment memberAssignment, (err, result) ->
        expect(err).to.be.null
        done()
