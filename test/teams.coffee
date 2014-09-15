describe 'teams', ->
  newTeam = null

  it 'should be able to load all teams', (done) ->
    teamsnap.loadTeams (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to load a teams data in bulk', (done) ->
    teamsnap.bulkLoad team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to create a new team', (done) ->
    newTeam = teamsnap.createTeam
      name: 'New Test Team'
      sportId: 1
      locationCountry: 'United States'
      locationPostalCode: 80302
      timeZone: 'America/Denver'

    teamsnap.saveTeam newTeam, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'team')
      result.should.have.property('id')
      result.should.equal(newTeam)
      done()

  it 'should be able to delete a team', (done) ->
    teamsnap.deleteTeam newTeam, (err, result) ->
      expect(err).to.be.null
      done()
