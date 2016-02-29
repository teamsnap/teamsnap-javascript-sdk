memberPayment = {}

describe 'Member Payments', ->

  beforeEach (done) ->
    team.members = [
      {
        id: 1,
        firstName: 'Ownie',
        lastName: 'Owner',
        memberPayments: [
          {
            type: 'memberPayment',
            id: 222,
            amountDue: 100.00,
            amountPaid: 50.00,
            memberId: 1,
            teamId: team.id

          }
        ]
      }
    ]
    memberPayment = team.members[0].memberPayments[0]
    done()

  describe 'loadMemberPayments', ->
    it 'should be able to load all member payments for team', ->
      teamsnap.loadMemberPayments team.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')

  describe 'memberPaymentTransaction', ->
    it 'should accept a memberPayment object', ->
      teamsnap.memberPaymentTransaction memberPayment, 4, (err, result) ->
        result.id.should.equal 222

    it 'should accept a memberPaymentId', ->
      teamsnap.memberPaymentTransaction memberPayment.id, 10.00, (err, result) ->
       result.id.should.equal 222

    it 'should adjust memberPayment.amoutPaid', ->
      teamsnap.memberPaymentTransaction memberPayment.id, 10.00, (err, result) ->
        result.amountPaid.should.equal 90.00
