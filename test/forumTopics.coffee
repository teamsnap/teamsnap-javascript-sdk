describe 'Forum Topics', ->

  topic = null

  it 'should be able to create a forum topic', (done) ->
    topic = teamsnap.createForumTopic()
    topic.teamId = team.id
    topic.title = "What a topic"
    teamsnap.saveForumTopic topic, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'forumTopic')
      done()

  it 'should be able to load all forum topics for team', (done) ->
    teamsnap.loadForumTopics {teamId: team.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to delete a forum topic', (done) ->
    teamsnap.deleteForumTopic topic, (err, result) ->
      expect(err).to.be.null
      done()
