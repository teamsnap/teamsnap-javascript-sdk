describe 'locations', ->

  it 'should be able to load all locations for team', (done) ->
    teamsnap.loadLocations 1, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()