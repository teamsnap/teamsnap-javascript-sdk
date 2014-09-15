describe 'Opponents', ->

  it 'should be able to load all opponents for team', (done) ->
    teamsnap.loadOpponents team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()