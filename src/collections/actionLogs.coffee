exports.teamImportCompleted = (teamId, importedRostersCount, callback) ->
  unless (teamId? and @isId teamId) and importedRostersCount?
    throw new TSArgsError 'teamsnap.teamImportCompleted', 'teamId and importedRostersCount must be present'

  params = teamId: teamId, importedRostersCount: importedRostersCount
  @collections.actionLogs.exec 'teamImportCompleted', params, callback
