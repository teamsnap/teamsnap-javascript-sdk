describe 'Member Photo', ->

  it 'should be able to load all members photos for a team', (done) ->
    teamsnap.loadMemberPhotos team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
