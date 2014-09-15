describe 'Team Public Sites', ->

  it 'should be able to load team public site info', (done) ->
    teamsnap.loadTeamPublicSite team.id, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamPublicSite')
      done()