describe 'Divisions', ->
  newDivision = null
  rootDivision = null
  childDivision = null

  before (done) ->
    rootDivision = teamsnap.createDivision
      name: 'Root Division'
      sportId: 1
      locationCountry: 'United States'
      locationPostalCode: 80302
      timeZone: 'America/Denver'

    childDivision = teamsnap.createDivision
      name: 'Child Division'
      sportId: 1
      parentId: rootDivision.id
      locationCountry: 'United States'
      locationPostalCode: 80302
      timeZone: 'America/Denver'

  after (done) ->
    teamsnap.deleteDivision rootDivision, (err, result) ->
      expect(err).to.be.null
      done()

  after (done) ->
    teamsnap.deleteDivision childDivision, (err, result) ->
      expect(err).to.be.null
      done()

  after (done) ->
    if newDivision
      teamsnap.deleteDivision newDivision, (err, result) ->
        expect(err).to.be.null
        done()

  it 'should be able to create a new division', (done) ->
    newDivision = teamsnap.createDivision
      name: 'New Test Team'
      sportId: 1
      locationCountry: 'United States'
      locationPostalCode: 80302
      timeZone: 'America/Denver'

  it 'should be able to load all divisions', (done) ->
    teamsnap.loadDivisions (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

    teamsnap.saveDivision newDivision, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'division')
      result.should.have.property('id')
      result.should.equal(newDivision)
      done()

  it 'should be able to load a division', (done) ->
    teamsnap.loadDivision newDivision.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')

  it 'should be able to delete a division', (done) ->
    teamsnap.deleteDivision newDivision, (err, result) ->
      expect(err).to.be.null
      done()

  it 'should be able to return a divisions ancestors', (done) ->
    teamsnap.ancestorDivisions childDivision.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to return a divisions descendants', (done) ->
    teamsnap.descendantDivisions rootDivision.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to return a divisions children', (done) ->
    teamsnap.childrenDivisions rootDivision.id, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()
