# You need to be authenticated as a commissioner in order to run these tests
# Being authed as a commissioner will break all the team tests
# describe 'Division Preferences', ->

#   it 'should be able to load preferences for Divisions', (done) ->
#     teamsnap.loadDivisionsPreferences divisionId: 1, (err, result) ->
#       expect(err).to.be.null
#       result.should.be.an('array')
#       done()


#   it 'should be able to load preferences for member', (done) ->
#     teamsnap.loadDivisionPreferences 1, (err, result) ->
#       expect(err).to.be.null
#       result.should.have.property('type', 'loadDivisionPreferences')
#       done()
