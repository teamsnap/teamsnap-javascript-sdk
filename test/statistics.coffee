describe 'Statistics', ->

  statistic = null
  
  it 'should be able to load all team statistics', (done) ->
    teamsnap.loadStatistics team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to create a team statistic', (done) ->
    statistic = teamsnap.createStatistic()
    statistic.teamId = team.id
    statistic.name = 'Test Statistic'
    statistic.acronym = 'TST'
    teamsnap.saveStatistic statistic, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'statistic')
      done()

  it 'should be able to delete a statistic', (done) ->
    teamsnap.deleteStatistic statistic, (err, result) ->
      expect(err).to.be.null
      done()