describe 'Events', ->

  it 'should be able to load all events for team', (done) ->
    teamsnap.loadEvents team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()