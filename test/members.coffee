describe 'members', ->

  it 'should be able to load all members for team', (done) ->
    teamsnap.loadMembers 1, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()