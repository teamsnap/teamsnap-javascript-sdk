describe 'Team Media', ->

  member = null
  teamMediaGroup = null
  teamMedium = null

  # First we'll need to create a member and teamMediaGroup
  before (done) ->
    # Create member
    member = teamsnap.createMember()
    member.teamId = team.id
    member.firstName = 'Test'
    teamsnap.saveMember member, (err, result) ->
      expect(err).to.be.null
      done()


  before (done) ->
    # Create teamMediaGroup
    teamMediaGroup = teamsnap.createTeamMediaGroup()
    teamMediaGroup.teamId = team.id
    teamMediaGroup.memberId = member.id
    teamMediaGroup.mediaFormat = 'video'
    teamMediaGroup.name = 'Test Media Group'
    teamsnap.saveTeamMediaGroup teamMediaGroup, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamMediaGroup')
      done()


  # Delete member (which should cleanup other created items)
  after (done) ->
    teamsnap.deleteMember member, (err, result) ->
      expect(err).to.be.null
      done()


  # Create teamMedium (video)
  it 'should be able to create a team video', (done) ->
    teamMedium = teamsnap.createTeamMedium()
    teamMedium.teamMediaGroupId = teamMediaGroup.id
    teamMedium.teamId = team.id
    teamMedium.memberId = member.id
    teamMedium.description = 'TeamSnap 15 Second Overview'
    teamMedium.videoUrl = 'https://www.youtube.com/watch?v=8swZ1XQNHQY'

    teamsnap.saveTeamVideoLink teamMedium, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamMedium')
      done()


  # Load all teamMedia
  it 'should be able to load all team media for team', (done) ->
    teamsnap.loadTeamMedia team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      result.should.have.property('length', 1)
      teamMedium = result.pop()
      done()


  # Delete Team Medium
  it 'should be able to delete a team medium', (done) ->
    teamsnap.deleteTeamMedium teamMedium, (err, result) ->
      expect(err).to.be.null
      done()
