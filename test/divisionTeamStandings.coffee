describe 'Division Team Standings', ->

  it 'should be able to load division team standings', (done) ->
    teamsnap.loadDivisionTeamStandings team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
