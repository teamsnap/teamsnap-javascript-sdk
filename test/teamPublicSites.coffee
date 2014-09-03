describe.skip 'team public sites', ->

  it 'should be able to load a team\'s public site info', (done) ->
    teamsnap.loadTeamPublicSite 1, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamPublicSite')
      done()