describe 'team public sites', ->

  it 'should be able to load a team\'s public site info', (done) ->
    teamsnap.loadTeamPublicSite team.id, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamPublicSite')
      done()