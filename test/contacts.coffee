describe 'contacts', ->

  it 'should be able to load all contacts for team', (done) ->
    teamsnap.loadContacts 1, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()