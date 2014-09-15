describe 'Locations', ->

  it 'should be able to load all locations for team', (done) ->
    teamsnap.loadLocations team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()