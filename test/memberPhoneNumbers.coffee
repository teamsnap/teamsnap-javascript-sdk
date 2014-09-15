describe 'Member Phone Numbers', ->
  member = null
  phone = null

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


  it 'should be able to load all member phones for team', (done) ->
    teamsnap.loadMemberPhoneNumbers team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  
  it 'should be able to create a member phone', (done) ->
    phone = teamsnap.createMemberPhoneNumber()
    phone.memberId = member.id
    phone.url = 'http://example.com'
    phone.phoneNumber = value = 'An example'
    teamsnap.saveMemberPhoneNumber phone, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('phoneNumber', value)
      teamsnap.loadMemberPhoneNumbers memberId: member.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        result.should.have.property('length', 1)
        done()

  
  it 'should be able to update a member phone', (done) ->
    phone.phoneNumber = value = 'Changed text'
    teamsnap.saveMemberPhoneNumber phone, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('phoneNumber', value)
      done()

  
  it 'should be able to delete a member phone', (done) ->
    teamsnap.deleteMemberPhoneNumber phone, (err, result) ->
      expect(err).to.be.null
      teamsnap.loadMemberPhoneNumbers memberId: member.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        result.should.have.property('length', 0)
        done()
