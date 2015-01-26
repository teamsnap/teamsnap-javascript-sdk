describe 'Forum Subscriptions', ->

  it 'should be able to load all forum subscriptions for team', (done) ->
    teamsnap.loadForumSubscriptions {teamId: team.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
