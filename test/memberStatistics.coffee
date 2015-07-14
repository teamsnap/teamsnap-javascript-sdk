describe 'Member Statistics', ->
  
  it 'should be able to load all statistics for member', (done) ->
    teamsnap.loadMemberStatistics team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()