describe 'Contacts', ->

  it 'should be able to load all contacts for team', (done) ->
    teamsnap.loadContacts team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()