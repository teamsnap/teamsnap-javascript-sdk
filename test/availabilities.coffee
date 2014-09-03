describe 'availabilities', ->

  it 'should be able to load all availabilities for team', (done) ->
    teamsnap.loadAvailabilities 1, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()