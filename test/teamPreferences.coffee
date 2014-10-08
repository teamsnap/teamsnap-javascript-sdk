describe 'Team Preferences', ->

  it 'should be able to load preferences for teams', (done) ->
    teamsnap.loadMe().then (me) ->
      teamsnap.loadTeamsPreferences userId: me.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        done()

  it 'should be able to load team preferences', (done) ->
    teamsnap.loadTeamPreferences team.id, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamPreferences')
      done()
