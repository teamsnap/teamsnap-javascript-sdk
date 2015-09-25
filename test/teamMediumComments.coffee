describe 'Team Medium Comments', ->

  member = null
  teamMediaGroup = null
  teamMedium = null

  # First we'll need to create a member, teamMediaGroup, and teamMedium
  before (done) ->
    # Create member
    member = teamsnap.createMember()
    member.teamId = team.id
    member.firstName = 'Test'
    teamsnap.saveMember member, (err, result) ->
      expect(err).to.be.null
      done()

    # Create teamMediaGroup
    teamMediaGroup = teamsnap.createTeamMediaGroup()
    teamMediaGroup.teamId = team.id
    teamMediaGroup.memberId = member.id
    teamMediaGroup.mediaFormat = 'video'
    teamsnap.saveTeamMediaGroup teamMediaGroup, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamMediaGroup')
      done()

    # Create teamMedium
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


  # Delete member (which should cleanup other created items)
  after (done) ->
    teamsnap.deleteMember member, (err, result) ->
      expect(err).to.be.null
      done()


  # Create teamMediumComment
  it 'should be able to create a team medium comment', (done) ->
    teamMediumComment = teamsnap.createTeamMediumComment()
    teamMediumComment.teamId = team.id
    teamMediumComment.memberId = member.id
    teamMediumComment.teamMediumId = teamMedium.id
    teamMediumComment.comment = 'Test comment!!!'

    teamsnap.saveTeamMediumComment teamMediumComment, (err, response) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamMediumComment')
      done()


  # Load all teamMediumComments
  it 'should be able to load all team medium comments for team', (done) ->
    teamsnap.loadTeamMediumComments team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
