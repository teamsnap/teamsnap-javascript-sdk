describe 'Broadcast Email Attachments', ->

  email = null
  sender = null
  recipient = null

  before (done) ->
    teamsnap.loadMe().then (me) ->
      teamsnap.loadMembers userId: me.id, (err, result) ->
        result.should.be.an('array')
        sender = result[0]
        done()

  before (done) ->
    recipient = teamsnap.createMember()
    recipient.teamId = team.id
    recipient.firstName = 'Test'
    teamsnap.saveMember recipient, (err, result) ->
      expect(err).to.be.null
      memberEmail = teamsnap.createMemberEmailAddress()
      memberEmail.memberId = recipient.id
      memberEmail.email = "recipient@example.com"
      teamsnap.saveMemberEmailAddress memberEmail, (err, result) ->
        expect(err).to.be.null
        email = teamsnap.createBroadcastEmail()
        email.teamId = team.id
        email.memberId = sender.id
        email.body = "Hello world"
        email.subject = "Subject!"
        email.recipientIds = [recipient.id]
        teamsnap.saveBroadcastEmail email, (err, result) ->
          expect(err).to.be.null
          done()

  after (done) ->
    teamsnap.deleteMember recipient, (err, result) ->
      expect(err).to.be.null
      done()

  # how do we test uploading a file?

  it 'should be able to load broadcast email attachments', (done) ->
    teamsnap.loadBroadcastEmailAttachments {broadcastEmailId: email.id}, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        done()


