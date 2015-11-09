describe 'Broadcast Alerts', ->

  alert = null
  sender = null
  recipient = null

  before (done) ->
    teamsnap.loadMe().then (me) ->
      teamsnap.loadMembers {userId: me.id}, (err, result) ->
        expect(err).to.be.null
        expect(result.length).to.be.above(0)
        sender = result[0]
        recipient = teamsnap.createMember()
        recipient.teamId = sender.teamId
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
    teamsnap.deleteMember recipient, (err, result) ->
      expect(err).to.be.null
      done()

  it 'should be able to create a broadcast alert', (done) ->
    alert = teamsnap.createBroadcastAlert()
    alert.teamId = team.id
    alert.memberId = sender.id
    alert.body = "Hello world"
    alert.recipientIds = [recipient.id]
    teamsnap.saveBroadcastAlert alert, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'broadcastAlert')
      result.should.have.property('recipientCount', 1)
      result.should.have.property('memberId', sender.id)
      result.should.have.property('body', "Hello world")
      done()

  it 'should be able to load all broadcast alerts for a team', (done) ->
    alert2 = teamsnap.createBroadcastAlert()
    alert2.teamId = team.id
    alert2.memberId = sender.id
    alert2.body = "Hello again world"
    alert2.recipientIds = [recipient.id]
    teamsnap.saveBroadcastAlert alert2, (err, result) ->
      expect(err).to.be.null
      teamsnap.loadBroadcastAlerts {teamId: team.id}, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        result.should.have.property('length', 2)
        done()

  it 'should be able to load a single broadcast alert', (done) ->
    teamsnap.loadBroadcastAlerts {id: alert.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      result.should.have.property('length', 1)
      result[0].should.have.property('id', alert.id)
      done()


  it 'should be able to delete a broadcast alert', (done) ->
    teamsnap.deleteBroadcastAlert alert, (err, result) ->
      expect(err).to.be.null
      done()

