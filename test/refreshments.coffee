describe 'refreshments', ->

  it.skip 'should be able to load all refreshments for team', (done) ->
    teamsnap.loadRefreshments 1, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()