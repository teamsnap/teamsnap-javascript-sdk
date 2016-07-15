memberAssignment = {}

describe 'memberAssignments', ->

  before (done) ->
    memberAssignment = teamsnap.createMemberAssignment()
    memberAssignment.memberId = 2
    memberAssignment.assignmentId = 3
    memberAssignment.teamId = team.id
    done()

  after (done) ->
    memberAssignment = {}
    done()

  describe 'teamsnap.loadMemberAssignments', ->
    it 'should load an array of member assignments by team id', (done) ->
      teamsnap.loadMemberAssignments team.id, (err, result) ->
        result.should.be.an('array')
        done()

  describe 'teamsnap.createMemberAssignment', ->
    it 'should create an item with type "memberAssignment"', ->
      memberAssignment = teamsnap.createMemberAssignment()
      memberAssignment.should.have.property 'type', 'memberAssignment'

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
