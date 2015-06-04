describe 'Statistic Groups', ->

  statisticGroup = null
  
  it 'should be able to load all team statistic groups', (done) ->
    teamsnap.loadStatisticGroups team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to create a team statistic group', (done) ->
    statisticGroup = teamsnap.createStatisticGroup()
    statisticGroup.teamId = team.id
    statisticGroup.name = 'Test Statistic'
    statisticGroup.acronym = 'TST'
    teamsnap.saveStatisticGroup statisticGroup, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'statisticGroup')
      done()

  it 'should be able to delete a statistic group', (done) ->
    teamsnap.deleteStatisticGroup statisticGroup, (err, result) ->
      expect(err).to.be.null
      done()