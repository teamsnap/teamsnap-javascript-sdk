describe 'Tracked Items', ->

  it 'should be able to load all tracked items for a team', (done) ->
    teamsnap.loadTrackedItems team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
