describe 'Availabilities', ->

  it 'should be able to load all availabilities for team', (done) ->
    teamsnap.loadAvailabilities team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()