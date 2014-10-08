describe 'Member Preferences', ->

  it 'should be able to load preferences for members', (done) ->
    teamsnap.loadMe().then (me) ->
      teamsnap.loadMembersPreferences userId: me.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        done()


  it 'should be able to load preferences for member', (done) ->
    teamsnap.loadMemberPreferences team.id, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'memberPreferences')
      done()
