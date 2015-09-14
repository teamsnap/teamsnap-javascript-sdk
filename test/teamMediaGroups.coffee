describe 'Team Media Groups', ->

  it 'should be able to load all team media groups for team', (done) ->
    teamsnap.loadTeamMediaGroups team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
