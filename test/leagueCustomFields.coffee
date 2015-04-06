describe 'League Custom Fields', ->

  it 'should be able to load all league custom fields for team', (done) ->
    teamsnap.loadLeagueCustomFields team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
