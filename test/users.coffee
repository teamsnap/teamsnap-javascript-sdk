describe 'users', ->

  it 'should be able to load all users for team', (done) ->
    teamsnap.loadUsers 1, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()