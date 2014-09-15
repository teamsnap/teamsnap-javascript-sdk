describe 'Contact Phone Numbers', ->

  it 'should be able to load all contact phone numbers for team', (done) ->
    teamsnap.loadContactPhoneNumbers team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()