describe 'Team Media', ->

  it 'should be able to load all team media for team', (done) ->
    teamsnap.loadTeamMedia team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
