describe 'Division Aggregates', ->

  it 'should be able to load all league custom fields for team', (done) ->
    teamsnap.loadDivisionAggregates division.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
