before (done) ->
  window.team = teamsnap.createTeam
    name: 'Test Team'
    sportId: 1
    planId: 30
    locationCountry: 'United States'
    locationPostalCode: 80302
    timeZone: 'America/Denver'
  mocha.checkLeaks()
  teamsnap.saveTeam team, done

after (done) ->
  teamsnap.deleteTeam team, done
