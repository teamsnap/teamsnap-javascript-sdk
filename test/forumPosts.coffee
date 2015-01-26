describe 'Forum Posts', ->

  topic = null
  post = null
  member = null

  before (done) ->
    topic = teamsnap.createForumTopic()
    topic.teamId = team.id
    topic.title = "What a topic"
    teamsnap.saveForumTopic topic, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'forumTopic')
      done()

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

  it 'should be able to create a forum post', (done) ->
    post = teamsnap.createForumPost()
    post.forumTopicId = topic.id
    post.memberId = member.id
    post.message = "What a post"
    teamsnap.saveForumPost post, (err, result) ->
      expect(err).to.be.null
      result.should.have.property('type', 'forumPost')
      done()

  it 'should be able to load all forum posts for team', (done) ->
    teamsnap.loadForumPosts {teamId: team.id}, (err, result) ->
      expect(err).to.be.null
      result.should.be.an('array')
      done()

  it 'should be able to delete a forum post', (done) ->
    teamsnap.deleteForumPost post, (err, result) ->
      expect(err).to.be.null
      done()
