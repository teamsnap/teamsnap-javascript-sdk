describe 'Payment Notes', ->

  it 'should be able to load all payment notes for a team', (done) ->
    teamsnap.loadPaymentNotes team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to create a payment note', (done) ->
    paymentNote = teamsnap.createPaymentNote()
    paymentNote.teamId = team.id
    paymentNote.memberPaymentId = 1
    paymentNote.note = 'Test payment note.'
    paymentNote.description = 'Payment Note Description'
    teamsnap.savePaymentNote paymentNote, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'paymentNote')
      done()