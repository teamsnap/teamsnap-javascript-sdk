describe 'Team Photo', ->

  it 'should be able to load all team photos for a team', (done) ->
    teamsnap.loadTeamPhotos team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
