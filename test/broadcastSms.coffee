describe 'Broadcast Smses', ->

  sms = null
  member = null

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

  it 'should be able to create a broadcast sms', (done) ->
    sms = teamsnap.createBroadcastSms()
    sms.teamId = team.id
    sms.memberId = member.id
    sms.body = "Hello world"
    sms.recipientIds = [2, 3]
    teamsnap.saveBroadcastSms sms, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'broadcastSms')
      done()

  it 'should be able to load all broadcast smses for a team', (done) ->
    teamsnap.loadBroadcastSmses {teamId: team.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to load a single broadcast sms', (done) ->
    teamsnap.loadBroadcastSmses 1, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()


  it 'should be able to delete a forum topic', (done) ->
    teamsnap.deleteBroadcastSms sms, (err, result) ->
      expect(err).to.be.null
      done()

