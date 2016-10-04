describe 'Broadcast Emails', ->

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
        done()

  after (done) ->
    teamsnap.deleteMember recipient, (err, result) ->
      expect(err).to.be.null
      done()

  it 'should be able to create a broadcast email', (done) ->
    email = teamsnap.createBroadcastEmail()
    email.teamId = team.id
    email.memberId = sender.id
    email.body = "Hello world"
    email.subject = "Subject!"
    email.recipientIds = [recipient.id]
    teamsnap.saveBroadcastEmail email, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'broadcastEmail')
      result.should.have.property('recipientCount', 1)
      result.should.have.property('memberId', sender.id)
      result.should.have.property('body', "Hello world")
      done()

  it 'should not save a broadcast email with no recipients unless is a draft', (done) ->
    email = teamsnap.createBroadcastEmail()
    email.teamId = team.id
    email.memberId = sender.id
    email.body = "Hello world"
    email.subject = "Subject!"
    email.recipientIds = []
    email.isDraft = false
    teamsnap.saveBroadcastEmail(email).then (result) ->
      result.type.should.not.equal('broadcastEmail')
      done()
    , (err) ->
      expect(err).to.not.be.null
      done()

  it 'should not save a broadcast email if recipientIds is not an array', (done) ->
    email = teamsnap.createBroadcastEmail()
    email.teamId = team.id
    email.memberId = sender.id
    email.body = "Hello world"
    email.subject = "Subject!"
    email.recipientIds = '1,2'
    email.isDraft = false
    teamsnap.saveBroadcastEmail(email).then (result) ->
      result.type.should.not.equal('broadcastEmail')
      done()
    , (err) ->
      expect(err).to.not.be.null
      done()

  it 'should save a broadcast email with no recipients if it is a draft', (done) ->
    email = teamsnap.createBroadcastEmail()
    email.teamId = team.id
    email.memberId = sender.id
    email.body = "Hello world"
    email.subject = "Subject!"
    email.recipientIds = []
    email.isDraft = true
    teamsnap.saveBroadcastEmail(email).then (result) ->
      result.type.should.equal('broadcastEmail')
      done()
    , (err) ->
      expect(err).to.be.null
      done()

  it 'should be able to load all broadcast emails for a team', (done) ->
    teamsnap.loadBroadcastEmails {teamId: team.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      expect(result.length).to.be.above(0)
      done()

  it 'should be able to load a single broadcast email', (done) ->
    teamsnap.loadBroadcastEmails {id: email.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      result.should.have.property('length', 1)
      result[0].should.have.property('id', email.id)
      done()


  it 'should be able to delete a broadcast email', (done) ->
    teamsnap.deleteBroadcastEmail email, (err, result) ->
      expect(err).to.be.null
      done()

  it 'should be able to bulk delete broadcast email', (done) ->
    teamsnap.bulkDeleteBroadcastEmails [email.id], (err, result) ->
      expect(err).to.be.null
      done()

