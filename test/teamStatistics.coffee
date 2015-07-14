describe 'Team Statistics', ->
  
  it 'should be able to load all statistics for team', (done) ->
    teamsnap.loadTeamStatistics team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()