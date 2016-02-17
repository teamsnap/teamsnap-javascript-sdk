describe 'Member Email Addresses', ->
  member = null
  email = null

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

  it 'should be able to invite a member email', (done) ->
    manager = teamsnap.createMember()
    manager.teamId = team.id
    manager.firstName = 'Manager'
    teamsnap.saveMember manager, (err, result) ->
      email = teamsnap.createMemberEmailAddress()
      email.memberId = member.id
      email.email = value = 'test@example.com'
      teamsnap.saveMemberEmailAddress email, (err, result) ->
        expect(err).to.be.null
        result.should.have.property('email', value)

        options =
          teamId: team.id
          introduction: "Welcome to the team!"
          memberId: member.id
          memberEmailAddressIds: "#{email.id}"
          notifyAsMemberId: manager.id

        teamsnap.inviteMemberEmailAddresses options, (err, result) ->
          expect(err).to.be.null
          result.should.have.property('invitationState', 'new')
          done()

