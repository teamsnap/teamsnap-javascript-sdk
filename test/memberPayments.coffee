describe 'Member Payments', ->

  it 'should be able to load all member payments for team', (done) ->
    teamsnap.loadMemberPayments team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
