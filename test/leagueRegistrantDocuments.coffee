describe 'League Registrant Documents', ->
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

  it 'should be able to load all registrant documents for team', (done) ->
    teamsnap.loadLeagueRegistrantDocuments team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to load a single registrant`s documents', (done) ->
    teamsnap.loadLeagueRegistrantDocuments {memberId: member.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
