describe 'Assignments', ->

  it 'should be able to load all assignments for team', (done) ->
    teamsnap.loadAssignments team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()