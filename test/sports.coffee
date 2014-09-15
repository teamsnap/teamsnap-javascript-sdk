describe 'sports', ->

  it 'should be able to load all sports', ->
    expect(teamsnap.sports).to.be.an('array')

  it 'should be able to query sport for team', (done) ->
    teamsnap.loadSports teamId: team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      result.should.have.property('length', 1)
      result[0].should.have.property('type', 'sport')
      done()

  it 'should be able to load sport for a team', (done) ->
    teamsnap.loadSport team.id, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'sport')
      done()