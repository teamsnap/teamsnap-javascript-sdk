describe 'Member Photos', ->

  member = null

  before (done) ->
    member = teamsnap.createMember()
    member.teamId = team.id
    member.firstName = 'Test'
    teamsnap.saveMember member, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'member')
      done()

  after (done) ->
    teamsnap.deleteMember(member)
    done()


  it 'should be able to load all members photos for a team', (done) ->
    teamsnap.loadMemberPhotos team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      result[0].should.have.property('type', 'memberPhoto')
      done()

  it 'should be able to load a single member photo', (done) ->
    teamsnap.loadMemberPhoto member.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('object')
      result.should.have.property('type', 'memberPhoto')
      done()
