memberPayment = {}

describe 'Member Payments', ->
  beforeEach (done) ->
    memberPayment = {
      id: 1
      amountDue: 200.00
      amountPaid: 100.00
    }
    done()

  describe 'loadMemberPayments', ->
    it 'should be able to load all member payments for team', ->
      teamsnap.loadMemberPayments team.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')

  describe 'memberPaymentTransaction', ->
    it 'should accept a memberPayment object', ->
      teamsnap.memberPaymentTransaction memberPayment.id, 4, (err, result) ->
        result.id.should.equal 1

    it 'should accept a memberPaymentId', ->
      teamsnap.memberPaymentTransaction 2, 10.00, (err, result) ->
        result.id.should.equal 2

    it 'should adjust memberPayment.amoutPaid', ->
      teamsnap.memberPaymentTransaction memberPayment.id, 10.00, (err, result) ->
        result.amountPaid.should.equal 90.00
