describe 'Team Results', ->

  it 'should be able to load results for teams', (done) ->
    teamsnap.loadMe().then (me) ->
      teamsnap.loadTeamsResults userId: me.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        done()

  it 'should be able to load team results', (done) ->
    teamsnap.loadTeamResults team.id, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'teamResults')
      done()
