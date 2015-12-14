describe 'Event Statistics', ->

  it 'should be able to load all event statistics for a team', (done) ->
    teamsnap.loadEventStatistics team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
