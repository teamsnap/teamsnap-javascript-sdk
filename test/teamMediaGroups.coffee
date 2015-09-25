describe 'Team Media Groups', ->

  member = null

  # First we'll need to create a member
  before (done) ->
    # Create member
    member = teamsnap.createMember()
    member.teamId = team.id
    member.firstName = 'Test'
    teamsnap.saveMember member, (err, result) ->
      expect(err).to.be.null
      done()


  # Delete member (which should cleanup other created items)
  after (done) ->
    teamsnap.deleteMember member, (err, result) ->
      expect(err).to.be.null
      done()


  # Create teamMediaGroup
  it 'should be able to create a team media group', (done) ->
    teamMediaGroup = teamsnap.createTeamMediaGroup()
    teamMediaGroup.teamId = team.id
    teamMediaGroup.memberId = member.id
    teamMediaGroup.mediaFormat = 'photo'
    teamMediaGroup.name = 'Test Media Group'

    teamsnap.saveTeamMediaGroup teamMediaGroup, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamMediaGroup')
      done()


  # Load all teamMediaGroups
  it 'should be able to load all team media groups for team', (done) ->
    teamsnap.loadTeamMediaGroups team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
