describe 'Messages', ->

  sender = null
  recipient = null

  before (done) ->
    teamsnap.loadMe().then (me) ->
      teamsnap.loadMembers {userId: me.id}, (err, result) ->
        expect(err).to.be.null
        expect(result.length).to.be.above(0)
        sender = result[0]
        done()

  it 'should be able to load all messages for team', (done) ->
    teamsnap.loadMessages team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()


  it 'should be able to mark message as read by ID', (done) ->
    alert = teamsnap.createBroadcastAlert()
    alert.teamId = team.id
    alert.memberId = sender.id
    alert.body = "Hello again world"
    alert.recipientIds = [sender.id]
    teamsnap.saveBroadcastAlert alert, (err, result) ->
      expect(err).to.be.null
      teamsnap.loadMessages team.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        messages = result.filter (i) ->
          i.messageId is alert.id and
          i.status is 'received'
        expect(messages[0].readAt).to.be.null
        teamsnap.markMessageAsRead messages[0].id, (err, result) ->
          console.log(err);
          expect(err).to.be.null
          expect(result.readAt).to.not.be.null
          done()

  it 'should be able to mark message as read by object', (done) ->
    alert = teamsnap.createBroadcastAlert()
    alert.teamId = team.id
    alert.memberId = sender.id
    alert.body = "Hello again world"
    alert.recipientIds = [sender.id]
    teamsnap.saveBroadcastAlert alert, (err, result) ->
      teamsnap.loadMessages team.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        console.log(result)
        messages = result.filter (i) ->
          i.messageId is alert.id and
          i.status is 'received'
        expect(messages[0].readAt).to.be.null
        teamsnap.markMessageAsRead messages[0], (err, result) ->
          console.log(err);
          expect(err).to.be.null
          expect(result.readAt).to.not.be.null
          done()
