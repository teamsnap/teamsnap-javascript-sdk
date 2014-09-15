describe 'tracking', ->

  it 'should be able to load all tracked items for a team', (done) ->
    teamsnap.loadTrackedItems team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to load all tracked item statuses for a team', (done) ->
    teamsnap.loadTrackedItemStatuses team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()