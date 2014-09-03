describe 'preferences', ->

  it.skip 'should be able to load preferences for member', (done) ->
    teamsnap.loadMemberPreferences 1, (err, results) ->
      expect(err).to.be.null
      results.should.have.property('type', 'memberPreferences')
      done()

  it 'should be able to load preferences for team', (done) ->
    teamsnap.loadTeamPreferences 1, (err, results) ->
      expect(err).to.be.null
      results.should.have.property('type', 'TeamPreferences')
      done()

  it.skip 'should be able to load all preferences', (done) ->
    teamsnap.loadPreferences 1, (err, memberPrefs, teamPrefs) ->
      expect(err).to.be.null
      memberPrefs.should.have.property('type', 'memberPreferences')
      teamPrefs.should.have.property('type', 'teamPreferences')
      done()