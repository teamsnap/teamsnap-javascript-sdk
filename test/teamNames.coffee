describe 'Team Names', ->

  teamname = null
  
  it 'should be able to load all team names', (done) ->
    teamsnap.loadTeamnames team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
