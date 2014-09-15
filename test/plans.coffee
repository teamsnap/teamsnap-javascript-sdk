describe 'plans', ->

  it 'should be able to load all plans', ->
    expect(teamsnap.plans).to.be.an('array')

  it 'should be able to query plan for team', (done) ->
    teamsnap.loadPlans teamId: team.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      result.should.have.property('length', 1)
      result[0].should.have.property('type', 'plan')
      done()

  it 'should be able to load plan for team', (done) ->
    teamsnap.loadPlan team.id, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'plan')
      done()