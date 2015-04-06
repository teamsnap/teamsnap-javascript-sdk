describe 'League Custom Data', ->

  it 'should be able to load all league custom data', (done) ->
    teamsnap.loadLeagueCustomData {teamId: team.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
