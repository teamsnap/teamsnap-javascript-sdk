describe 'DivisionLocations', ->

  it 'should be able to load all division locations for team', (done) ->
    teamsnap.loadDivisionLocations team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
