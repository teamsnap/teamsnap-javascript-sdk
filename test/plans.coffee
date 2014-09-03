describe 'plans', ->

  it 'should be able to load all plans', ->
    expect(teamsnap.plans).to.be.an('array')

  it.skip 'should be able to load plan for team', (done) ->
    teamsnap.loadPlan 1, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'plan')
      done()