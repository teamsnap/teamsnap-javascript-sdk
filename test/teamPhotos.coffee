describe 'Team Photos', ->

  it 'should be able to load all team photos for a team', (done) ->
    teamsnap.loadTeamPhotos team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      result[0].should.have.property('type', 'teamPhoto')
      done()

  it 'should be able to load a single team photo', (done) ->
    teamsnap.loadTeamPhoto team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('object')
      result.should.have.property('type', 'teamPhoto')
      done()
