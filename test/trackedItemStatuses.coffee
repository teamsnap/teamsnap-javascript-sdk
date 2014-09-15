describe 'Tracked Item Statuses', ->

  it 'should be able to load all tracked item statuses for a team', (done) ->
    teamsnap.loadTrackedItemStatuses team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
