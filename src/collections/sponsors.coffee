exports.loadSponsors = (params, callback) ->
  if @isId params
    params = teamId: params
  else unless params and typeof params is 'object'
    throw new TSArgsError 'teamsnap.loadSponsors', 'must provide a teamId or
      query parameters'

  @loadItems 'sponsor', params, callback


exports.createSponsor = (data) ->
  @createItem data,
    type: 'sponsor'
    name: ''


exports.saveSponsor = (sponsor, callback) ->
  unless sponsor
    throw new TSArgsError 'teamsnap.saveSponsor',
      "`sponsor` must be provided"
  unless @isItem sponsor, 'sponsor'
    throw new TSArgsError 'teamsnap.saveSponsor',
      "`sponsor.type` must be 'sponsor'"

  @saveItem sponsor, callback


exports.deleteSponsor = (sponsor, callback) ->
  unless sponsor
    throw new TSArgsError 'teamsnap.deleteSponsor',
      "`sponsor` must be provided"

  @deleteItem sponsor, callback


exports.uploadSponsorLogo = (sponsorId, file, callback) ->
  if @isItem sponsorId, 'sponsor'
    sponsorId = sponsorId.id
  if typeof FormData is 'undefined'
    @reject 'Your browser does not support the new file upload APIs.', 'file',
      callback
  unless @isId sponsorId
    throw new TSArgsError 'teamsnap.uploadSponsorLogo', 'must include
      `sponsorId`'
  unless file instanceof File
    throw new TSArgsError 'teamsnap.uploadSponsorLogo', 'must include
      `file` as type File'

  params = sponsorId: sponsorId, file: file
  @collections.sponsors.exec('uploadSponsorLogo', params)
    .pop().callback callback


exports.deleteSponsorLogo = (sponsorId, callback) ->
  unless sponsorId
    throw new TSArgsError 'teamsnap.deleteSponsorLogo',
      "`sponsorId` must be provided"
  if @isItem sponsorId, 'sponsor'
    sponsorId = sponsorId.id
  if not @isId sponsorId
    throw new TSArgsError 'teamsnap.deleteSponsorLogo',
      "`sponsorId` must be a valid id"

  params = sponsorId: sponsorId
  @collections.sponsors.exec('removeSponsorLogo', params)
  .callback callback
