describe 'Contact Email Addresses', ->

  it 'should be able to load all contact email addresses for team', (done) ->
    teamsnap.loadContactEmailAddresses team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()