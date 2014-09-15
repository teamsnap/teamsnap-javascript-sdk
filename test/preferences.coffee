describe 'preferences', ->

  it 'should be able to load preferences for member', (done) ->
    teamsnap.loadMemberPreferences team.id, (err, results) ->
      expect(err).to.be.null
      results.should.have.property('type', 'memberPreferences')
      done()

  it 'should be able to load preferences for team', (done) ->
    teamsnap.loadTeamPreferences team.id, (err, results) ->
      expect(err).to.be.null
      results.should.have.property('type', 'teamPreferences')
      done()

  it 'should be able to load all preferences', (done) ->
    teamsnap.loadPreferences team.id, (err, memberPrefs, teamPrefs) ->
      expect(err).to.be.null
      memberPrefs.should.have.property('type', 'memberPreferences')
      teamPrefs.should.have.property('type', 'teamPreferences')
      done()