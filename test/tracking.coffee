describe 'tracking', ->

  it 'should be able to load all tracked items for a team', (done) ->
    teamsnap.loadTrackedItems 1, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it.skip 'should be able to load all tracked item statuses for a team', (done) ->
    teamsnap.loadTrackedItemStatuses 1, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()