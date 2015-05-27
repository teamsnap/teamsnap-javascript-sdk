describe 'Payment Notes', ->

  teamFee = null
  member = null
  memberPayment = null
  paymentNote = null

  before (done) ->
    teamFee = teamsnap.createTeamFee()
    teamFee.teamId = team.id
    teamFee.description = 'Test Team Fee'
    teamFee.amount = 1
    teamsnap.saveTeamFee teamFee, (err, result) ->
      expect(err).to.be.null
      done()

  before (done) ->
    member = teamsnap.createMember()
    member.teamId = team.id
    member.firstName = 'Test'
    teamsnap.saveMember member, (err, result) ->
      expect(err).to.be.null
      done()

  before (done) ->
    teamsnap.loadMemberPayments(
      {memberId: member.id, teamFeeId: teamFee.id}).then (memberPayments) ->
        memberPayment = memberPayments[0]
        done()

  after (done) ->
    teamsnap.deleteMember member, (err, result) ->
      expect(err).to.be.null
      done()

  after (done) ->
    teamsnap.deleteTeamFee teamFee, (err, result) ->
      expect(err).to.be.null
      done()

  it 'should be able to load all payment notes for a team', (done) ->
    teamsnap.loadPaymentNotes team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to create a payment note', (done) ->
    paymentNote = teamsnap.createPaymentNote()
    paymentNote.teamId = team.id
    paymentNote.memberPaymentId = memberPayment.id
    paymentNote.note = 'Test payment note.'
    paymentNote.description = 'Payment Note Description'
    teamsnap.savePaymentNote paymentNote, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'paymentNote')
      done()