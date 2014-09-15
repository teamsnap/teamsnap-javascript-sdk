describe 'Custom Fields', ->

  it 'should be able to load all custom fields for team', (done) ->
    teamsnap.loadCustomData team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
