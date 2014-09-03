describe 'sports', ->

  it 'should be able to load all sports', ->
    expect(teamsnap.sports).to.be.an('array')

  it.skip 'should be able to load sport for a team', (done) ->
    teamsnap.loadSport 1, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'sport')
      done()