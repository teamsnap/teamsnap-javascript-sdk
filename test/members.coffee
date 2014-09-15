describe 'members', ->
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


  # Member emails
  it 'should be able to load all member emails for team', (done) ->
    teamsnap.loadMemberEmailAddresses team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  
  it 'should be able to create a member email', (done) ->
    email = teamsnap.createMemberEmailAddress()
    email.memberId = member.id
    email.email = value = 'test@example.com'
    teamsnap.saveMemberEmailAddress email, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('email', value)
      teamsnap.loadMemberEmailAddresses memberId: member.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        result.should.have.property('length', 1)
        done()

  
  it 'should be able to update a member email', (done) ->
    email.email = value = 'test2@example.com'
    teamsnap.saveMemberEmailAddress email, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('email', value)
      done()

  
  it 'should be able to delete a member email', (done) ->
    teamsnap.deleteMemberEmailAddress email, (err, result) ->
      expect(err).to.be.null
      teamsnap.loadMemberEmailAddresses memberId: member.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        result.should.have.property('length', 0)
        done()


  # Member phones
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


  it 'should be able to delete a member', (done) ->
    teamsnap.deleteMember member, (err, result) ->
      expect(err).to.be.null
      done()