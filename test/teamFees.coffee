describe 'Team Fees', ->

  teamFee = null
  
  it 'should be able to load all team fees', (done) ->
    teamsnap.loadTeamFees team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to create a team fee', (done) ->
    teamFee = teamsnap.createTeamFee()
    teamFee.teamId = team.id
    teamFee.description = 'Test Team Fee'
    teamFee.amount = 1
    teamsnap.saveTeamFee teamFee, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamFee')
      done()

  it 'should be able to delete a team fee', (done) ->
    teamsnap.deleteTeamFee teamFee, (err, result) ->
      expect(err).to.be.null
      done()