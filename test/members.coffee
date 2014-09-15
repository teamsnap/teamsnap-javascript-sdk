describe 'Members', ->
  member = null
  email = null
  phone = null
  link = null


  it 'should be able to load all members for team', (done) ->
    teamsnap.loadMembers team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()


  it 'should be able to create a member', (done) ->
    member = teamsnap.createMember()
    member.teamId = team.id
    member.firstName = 'Test'
    teamsnap.saveMember member, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'member')
      done()


  it 'should be able to delete a member', (done) ->
    teamsnap.deleteMember member, (err, result) ->
      expect(err).to.be.null
      done()