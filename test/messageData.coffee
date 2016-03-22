describe 'Message Data', ->

  it 'should be able to load message data for team', (done) ->
    teamsnap.loadMessageData {teamId: team.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
