describe 'Division Message Data', ->

  it 'should be able to load division message data for team', (done) ->
    teamsnap.loadDivisionMessageData {teamId: team.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
