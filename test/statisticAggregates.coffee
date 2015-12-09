describe 'Statistic Aggregates', ->

  it 'should be able to load all statistic aggregates', (done) ->
    teamsnap.loadStatisticAggregates team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
