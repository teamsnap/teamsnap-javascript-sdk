describe 'teams', ->

  it 'should be able to load all teams', (done) ->
    teamsnap.loadTeams (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()