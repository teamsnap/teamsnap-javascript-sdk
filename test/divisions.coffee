
# describe 'Divisions', ->
#   newDivision = null
#   rootDivision = null
#   childDivision = null

#   before (done) ->
#     rootDivision = teamsnap.createDivision
#       name: 'Root Division'
#       sportId: 1
#       country: 'United States'
#       postalCode: 80302
#       timeZone: 'America/Denver'
#       parentId: 1
#     teamsnap.saveDivision rootDivision, (err, result) ->
#       expect(err).to.be.null

#       childDivision = teamsnap.createDivision
#         name: 'Child Division'
#         sportId: 1
#         parentId: rootDivision.id
#         country: 'United States'
#         postalCode: 80302
#         timeZone: 'America/Denver'
#       teamsnap.saveDivision childDivision, (err, result) ->
#         expect(err).to.be.null
#         done()

#   after (done) ->
#     teamsnap.deleteDivision childDivision, (err, result) ->
#       expect(err).to.be.null
#       done()

#   after (done) ->
#     if newDivision
#       teamsnap.deleteDivision newDivision, (err, result) ->
#         expect(err).to.be.null
#         done()
#     else
#       done()

#   after (done) ->
#     teamsnap.deleteDivision rootDivision, (err, result) ->
#       expect(err).to.be.null
#       done()

#   it 'should be able to create a new division', (done) ->
#     newDivision = teamsnap.createDivision
#       name: 'New Test Division'
#       sportId: 1
#       country: 'United States'
#       postalCode: 80302
#       timeZone: 'America/Denver'
#       parentId: rootDivision.id

#     teamsnap.saveDivision newDivision,  (err, result) ->
#       expect(err).to.be.null
#       done()

#   it 'should be able to load all divisions', (done) ->
#     teamsnap.loadDivisions (err, result) ->
#       expect(err).to.be.null
#       result.should.be.an('array')
#       done()

#   it 'should be able to load a division', (done) ->
#     teamsnap.loadDivision rootDivision.id, (err, result) ->
#       expect(err).to.be.null
#       result.should.be.an('object')
#       done()

#   it 'should be able to delete a division', (done) ->
#     teamsnap.deleteDivision newDivision, (err, result) ->
#       expect(err).to.be.null
#       newDivision = null
#       done()

#   it 'should be able to return a divisions ancestors', (done) ->
#     teamsnap.ancestorDivisions childDivision.id, (err, result) ->
#       expect(err).to.be.null
#       result.should.be.an('array')
#       done()

#   it 'should be able to return a divisions descendants', (done) ->
#     teamsnap.descendantDivisions rootDivision.id, (err, result) ->
#       expect(err).to.be.null
#       result.should.be.an('array')
#       done()

#   it 'should be able to return a divisions children', (done) ->
#     teamsnap.childrenDivisions rootDivision.id, (err, result) ->
#       expect(err).to.be.null
#       result.should.be.an('array')
#       done()
