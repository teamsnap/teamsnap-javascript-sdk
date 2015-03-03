describe 'DivisionMembers', ->
  member = null


  it 'should be able to load all division members for team', (done) ->
    teamsnap.loadDivisionMembers team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
