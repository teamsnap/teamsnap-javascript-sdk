describe 'Opponent Results', ->
  opponent1 = null
  opponent2 = null

  before (done) ->
    opponent1 = teamsnap.createOpponent()
    opponent1.teamId = team.id
    opponent1.name = "Valiant Opponent"
    teamsnap.saveOpponent opponent1, (err, result) ->
      expect(err).to.be.null
      done()

  before (done) ->
    opponent2 = teamsnap.createOpponent()
    opponent2.teamId = team.id
    opponent2.name = "A More Valiant Opponent"
    teamsnap.saveOpponent opponent2, (err, result) ->
      expect(err).to.be.null
      done()

  after (done) ->
    teamsnap.deleteOpponent opponent1, (err, result) ->
      expect(err).to.be.null
      done()

  after (done) ->
    teamsnap.deleteOpponent opponent2, (err, result) ->
      expect(err).to.be.null
      done()

  it 'should be able to load results for all team opponents', (done) ->
    teamsnap.loadMe().then (me) ->
      teamsnap.loadOpponentsResults teamId: team.id, (err, result) ->
        expect(err).to.be.null
        result.should.be.an('array')
        result.should.have.length(2)
        done()

  it 'should be able to load results for single opponent', (done) ->
    teamsnap.loadOpponentResults opponent1.id, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'opponentResults')
      done()
