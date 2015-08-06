exports.loadDivisionTeamStandings = (teamId, callback) ->
  unless @isId teamId
    throw new TSArgsError 'teamsnap.loadDivisionTeamStandings',
      'must provide a teamId'
  params = teamId: teamId
  @loadItems 'divisionTeamStanding', params, callback
