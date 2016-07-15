describe 'Member Assignments', ->
  
  describe 'teamsnap.loadMemberAssignments', ->
    it 'should load an array of member assignments by team id', (done) ->
      teamsnap.loadMemberAssignments team.id, (err, result) ->
        result.should.be.an('array')
        done()
