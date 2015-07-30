describe 'Member Balances', ->

  it 'should be able to load all member balances for team', (done) ->
    teamsnap.loadMemberBalances team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
