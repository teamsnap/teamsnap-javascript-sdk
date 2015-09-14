describe 'Team Medium Comments', ->

  it 'should be able to load all team medium comments for team', (done) ->
    teamsnap.loadTeamMediumComments team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
