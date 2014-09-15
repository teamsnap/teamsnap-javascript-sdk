describe.skip 'Member Links', ->
  member = null
  link = null

  before (done) ->
    member = teamsnap.createMember()
    member.teamId = team.id
    member.firstName = 'Test'
    teamsnap.saveMember member, (err, result) ->
      expect(err).to.be.null
      done()
  
  after (done) ->
    teamsnap.deleteMember member, (err, result) ->
      expect(err).to.be.null
      done()


  # Member links
  it 'should be able to load all member links for team', (done) ->
    teamsnap.loadMemberLinks team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  
  it 'should be able to create a member link', (done) ->
    link = teamsnap.createMemberLink()
    link.memberId = member.id
    link.url = 'http://example.com'
    link.description = value = 'An example'
    teamsnap.saveMemberLink link, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('description', value)
      teamsnap.loadMemberLinks memberId: member.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        result.should.have.property('length', 1)
        done()

  
  it 'should be able to update a member link', (done) ->
    link.description = value = 'Changed text'
    teamsnap.saveMemberLink link, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('description', value)
      done()

  
  it 'should be able to delete a member link', (done) ->
    teamsnap.deleteMemberLink link, (err, result) ->
      expect(err).to.be.null
      teamsnap.loadMemberLinks memberId: member.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        result.should.have.property('length', 0)
        done()
