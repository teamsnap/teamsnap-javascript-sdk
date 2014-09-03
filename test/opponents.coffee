describe 'opponents', ->

  it 'should be able to load all opponents for team', (done) ->
    teamsnap.loadOpponents 1, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()