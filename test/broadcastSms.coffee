describe 'Broadcast Smses', ->

  sms = null
  sender = null
  recipient = null

  before (done) ->
    sender = teamsnap.createMember()
    sender.teamId = team.id
    sender.firstName = 'Test'
    teamsnap.saveMember sender, (err, result) ->
      expect(err).to.be.null
      done()

  before (done) ->
    recipient = teamsnap.createMember()
    recipient.teamId = team.id
    recipient.firstName = 'Test'
    teamsnap.saveMember recipient, (err, result) ->
      expect(err).to.be.null
      phone = teamsnap.createMemberPhoneNumber()
      phone.memberId = recipient.id
      phone.phoneNumber = "1234567890"
      phone.smsEnabled = true
      phone.smsGatewayId = "verizon"
      teamsnap.saveMemberPhoneNumber phone, (err, result) ->
        expect(err).to.be.null
        done()

  after (done) ->
    teamsnap.deleteMember sender, (err, result) ->
      expect(err).to.be.null
      done()

  after (done) ->
    teamsnap.deleteMember recipient, (err, result) ->
      expect(err).to.be.null
      done()

  it 'should be able to create a broadcast sms', (done) ->
    sms = teamsnap.createBroadcastSms()
    sms.teamId = team.id
    sms.memberId = sender.id
    sms.body = "Hello world"
    sms.recipientIds = [recipient.id]
    teamsnap.saveBroadcastSms sms, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'broadcastSms')
      result.should.have.property('recipientCount', 1)
      result.should.have.property('memberId', sender.id)
      result.should.have.property('body', "Hello world")
      done()

  it 'should be able to load all broadcast smses for a team', (done) ->
    sms2 = teamsnap.createBroadcastSms()
    sms2.teamId = team.id
    sms2.memberId = sender.id
    sms2.body = "Hello again world"
    sms2.recipientIds = [recipient.id]
    teamsnap.saveBroadcastSms sms2, (err, result) ->
      expect(err).to.be.null
      teamsnap.loadBroadcastSmses {teamId: team.id}, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        result.should.have.property('length', 2)
        done()

  it 'should be able to load a single broadcast sms', (done) ->
    teamsnap.loadBroadcastSmses sms.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      result.should.have.property('length', 1)
      result[0].should.have.property('id', sms.id)
      done()


  it 'should be able to delete a forum topic', (done) ->
    teamsnap.deleteBroadcastSms sms, (err, result) ->
      expect(err).to.be.null
      done()

