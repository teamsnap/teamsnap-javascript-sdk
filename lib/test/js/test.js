(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("test/assignments", function(exports, require, module) {
describe('Assignments', function() {
  return it('should be able to load all assignments for team', function(done) {
    return teamsnap.loadAssignments(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/availabilities", function(exports, require, module) {
describe('Availabilities', function() {
  return it('should be able to load all availabilities for team', function(done) {
    return teamsnap.loadAvailabilities(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/contactEmailAddresses", function(exports, require, module) {
describe('Contact Email Addresses', function() {
  return it('should be able to load all contact email addresses for team', function(done) {
    return teamsnap.loadContactEmailAddresses(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/contactPhoneNumbers", function(exports, require, module) {
describe('Contact Phone Numbers', function() {
  return it('should be able to load all contact phone numbers for team', function(done) {
    return teamsnap.loadContactPhoneNumbers(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/contacts", function(exports, require, module) {
describe('Contacts', function() {
  return it('should be able to load all contacts for team', function(done) {
    return teamsnap.loadContacts(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/customData", function(exports, require, module) {
describe('Custom Fields', function() {
  return it('should be able to load all custom fields for team', function(done) {
    return teamsnap.loadCustomData(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/customFields", function(exports, require, module) {
describe('Custom Fields', function() {
  return it('should be able to load all custom fields for team', function(done) {
    return teamsnap.loadCustomFields(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/events", function(exports, require, module) {
describe('Events', function() {
  return it('should be able to load all events for team', function(done) {
    return teamsnap.loadEvents(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/init", function(exports, require, module) {
var apiInput, authButton, authInput, authSection, clientId, collections, redirect, scopes, url, whenAuthFailed, whenAuthed;

chai.should();

window.expect = chai.expect;

authSection = document.getElementById('auth');

authButton = document.getElementById('auth-button');

apiInput = document.getElementById('api-url');

authInput = document.getElementById('auth-url');

clientId = '1d228d706ce170d61f9368b5967bd7a1641e6ecf742434dc198047f1a36a930a';

redirect = 'http://localhost:8000/';

scopes = ['read', 'write_contacts', 'write_contact_email_addresses', 'write_events', 'write_locations', 'write_opponents', 'write_refreshments', 'write_rosters', 'write_roster_email_addresses', 'write_rosters_preferences', 'write_teams', 'write_teams_preferences', 'write_teams_results', 'write_tracked_items', 'write_tracked_item_statuses'];

if (typeof localStorage !== 'undefined' && (url = localStorage.getItem('teamsnap.apiUrl'))) {
  if (url) {
    apiInput.value = url;
  }
}

if (typeof localStorage !== 'undefined' && (url = localStorage.getItem('teamsnap.authUrl'))) {
  if (url) {
    authInput.value = url;
  }
}

teamsnap.apiUrl = apiInput.value;

teamsnap.authUrl = authInput.value;

apiInput.addEventListener('change', function() {
  teamsnap.apiUrl = apiInput.value;
  if (typeof localStorage !== 'undefined') {
    return localStorage.setItem('teamsnap.apiUrl', apiInput.value);
  }
});

authInput.addEventListener('change', function() {
  teamsnap.authUrl = authInput.value;
  if (typeof localStorage !== 'undefined') {
    return localStorage.setItem('teamsnap.authUrl', authInput.value);
  }
});

whenAuthed = function(sdk) {
  authSection.parentNode.removeChild(authSection);
  sessionStorage.setItem('collections', JSON.stringify(sdk.collections));
  window.teamsnap = sdk;
  mocha.setup('bdd');
  window.require.list().filter(function(_) {
    return /^test/.test(_);
  }).forEach(require);
  return mocha.run();
};

whenAuthFailed = function(sdk) {
  return authSection.style.display = '';
};

authButton.addEventListener('click', function() {
  authSection.style.display = 'none';
  return teamsnap.startBrowserAuth(redirect, scopes).then(whenAuthed, whenAuthFailed);
});

teamsnap.init(clientId);

if (teamsnap.isAuthed()) {
  authSection.style.display = 'none';
  try {
    collections = JSON.parse(sessionStorage.getItem('collections'));
  } catch (_error) {}
  teamsnap.auth(collections).then(whenAuthed, whenAuthFailed);
}

});

;require.register("test/locations", function(exports, require, module) {
describe('Locations', function() {
  return it('should be able to load all locations for team', function(done) {
    return teamsnap.loadLocations(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/memberEmailAddresses", function(exports, require, module) {
describe('Member Email Addresses', function() {
  var email, member;
  member = null;
  email = null;
  before(function(done) {
    member = teamsnap.createMember();
    member.teamId = team.id;
    member.firstName = 'Test';
    return teamsnap.saveMember(member, function(err, result) {
      expect(err).to.be["null"];
      return done();
    });
  });
  after(function(done) {
    return teamsnap.deleteMember(member, function(err, result) {
      expect(err).to.be["null"];
      return done();
    });
  });
  it('should be able to load all member emails for team', function(done) {
    return teamsnap.loadMemberEmailAddresses(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
  it('should be able to create a member email', function(done) {
    var value;
    email = teamsnap.createMemberEmailAddress();
    email.memberId = member.id;
    email.email = value = 'test@example.com';
    return teamsnap.saveMemberEmailAddress(email, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('email', value);
      return teamsnap.loadMemberEmailAddresses({
        memberId: member.id
      }, function(err, result) {
        expect(err).to.be["null"];
        result.should.be.an('array');
        result.should.have.property('length', 1);
        return done();
      });
    });
  });
  it('should be able to update a member email', function(done) {
    var value;
    email.email = value = 'test2@example.com';
    return teamsnap.saveMemberEmailAddress(email, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('email', value);
      return done();
    });
  });
  return it('should be able to delete a member email', function(done) {
    return teamsnap.deleteMemberEmailAddress(email, function(err, result) {
      expect(err).to.be["null"];
      return teamsnap.loadMemberEmailAddresses({
        memberId: member.id
      }, function(err, result) {
        expect(err).to.be["null"];
        result.should.be.an('array');
        result.should.have.property('length', 0);
        return done();
      });
    });
  });
});

});

require.register("test/memberLinks", function(exports, require, module) {
describe.skip('Member Links', function() {
  var link, member;
  member = null;
  link = null;
  before(function(done) {
    member = teamsnap.createMember();
    member.teamId = team.id;
    member.firstName = 'Test';
    return teamsnap.saveMember(member, function(err, result) {
      expect(err).to.be["null"];
      return done();
    });
  });
  after(function(done) {
    return teamsnap.deleteMember(member, function(err, result) {
      expect(err).to.be["null"];
      return done();
    });
  });
  it('should be able to load all member links for team', function(done) {
    return teamsnap.loadMemberLinks(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
  it('should be able to create a member link', function(done) {
    var value;
    link = teamsnap.createMemberLink();
    link.memberId = member.id;
    link.url = 'http://example.com';
    link.description = value = 'An example';
    return teamsnap.saveMemberLink(link, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('description', value);
      return teamsnap.loadMemberLinks({
        memberId: member.id
      }, function(err, result) {
        expect(err).to.be["null"];
        result.should.be.an('array');
        result.should.have.property('length', 1);
        return done();
      });
    });
  });
  it('should be able to update a member link', function(done) {
    var value;
    link.description = value = 'Changed text';
    return teamsnap.saveMemberLink(link, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('description', value);
      return done();
    });
  });
  return it('should be able to delete a member link', function(done) {
    return teamsnap.deleteMemberLink(link, function(err, result) {
      expect(err).to.be["null"];
      return teamsnap.loadMemberLinks({
        memberId: member.id
      }, function(err, result) {
        expect(err).to.be["null"];
        result.should.be.an('array');
        result.should.have.property('length', 0);
        return done();
      });
    });
  });
});

});

require.register("test/memberPhoneNumbers", function(exports, require, module) {
describe('Member Phone Numbers', function() {
  var member, phone;
  member = null;
  phone = null;
  before(function(done) {
    member = teamsnap.createMember();
    member.teamId = team.id;
    member.firstName = 'Test';
    return teamsnap.saveMember(member, function(err, result) {
      expect(err).to.be["null"];
      return done();
    });
  });
  after(function(done) {
    return teamsnap.deleteMember(member, function(err, result) {
      expect(err).to.be["null"];
      return done();
    });
  });
  it('should be able to load all member phones for team', function(done) {
    return teamsnap.loadMemberPhoneNumbers(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
  it('should be able to create a member phone', function(done) {
    var value;
    phone = teamsnap.createMemberPhoneNumber();
    phone.memberId = member.id;
    phone.url = 'http://example.com';
    phone.phoneNumber = value = 'An example';
    return teamsnap.saveMemberPhoneNumber(phone, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('phoneNumber', value);
      return teamsnap.loadMemberPhoneNumbers({
        memberId: member.id
      }, function(err, result) {
        expect(err).to.be["null"];
        result.should.be.an('array');
        result.should.have.property('length', 1);
        return done();
      });
    });
  });
  it('should be able to update a member phone', function(done) {
    var value;
    phone.phoneNumber = value = 'Changed text';
    return teamsnap.saveMemberPhoneNumber(phone, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('phoneNumber', value);
      return done();
    });
  });
  return it('should be able to delete a member phone', function(done) {
    return teamsnap.deleteMemberPhoneNumber(phone, function(err, result) {
      expect(err).to.be["null"];
      return teamsnap.loadMemberPhoneNumbers({
        memberId: member.id
      }, function(err, result) {
        expect(err).to.be["null"];
        result.should.be.an('array');
        result.should.have.property('length', 0);
        return done();
      });
    });
  });
});

});

require.register("test/memberPreferences", function(exports, require, module) {
describe('Member Preferences', function() {
  it('should be able to load preferences for members', function(done) {
    return teamsnap.loadMembersPreferences({
      userId: teamsnap.me.id
    }, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
  return it('should be able to load preferences for member', function(done) {
    return teamsnap.loadMemberPreferences(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('type', 'memberPreferences');
      return done();
    });
  });
});

});

require.register("test/members", function(exports, require, module) {
describe('Members', function() {
  var email, link, member, phone;
  member = null;
  email = null;
  phone = null;
  link = null;
  it('should be able to load all members for team', function(done) {
    return teamsnap.loadMembers(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
  it('should be able to create a member', function(done) {
    member = teamsnap.createMember();
    member.teamId = team.id;
    member.firstName = 'Test';
    return teamsnap.saveMember(member, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('type', 'member');
      return done();
    });
  });
  return it('should be able to delete a member', function(done) {
    return teamsnap.deleteMember(member, function(err, result) {
      expect(err).to.be["null"];
      return done();
    });
  });
});

});

require.register("test/opponents", function(exports, require, module) {
describe('Opponents', function() {
  return it('should be able to load all opponents for team', function(done) {
    return teamsnap.loadOpponents(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/plans", function(exports, require, module) {
describe('Plans', function() {
  it('should be able to load all plans', function() {
    return expect(teamsnap.plans).to.be.an('array');
  });
  it('should be able to query plan for team', function(done) {
    return teamsnap.loadPlans({
      teamId: team.id
    }, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      result.should.have.property('length', 1);
      result[0].should.have.property('type', 'plan');
      return done();
    });
  });
  return it('should be able to load plan for team', function(done) {
    return teamsnap.loadPlan(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('type', 'plan');
      return done();
    });
  });
});

});

require.register("test/setup", function(exports, require, module) {
before(function(done) {
  window.team = teamsnap.createTeam({
    name: 'Test Team',
    sportId: 1,
    planId: 30,
    locationCountry: 'United States',
    locationPostalCode: 80302,
    timeZone: 'America/Denver'
  });
  mocha.checkLeaks();
  return teamsnap.saveTeam(team, done);
});

after(function(done) {
  return teamsnap.deleteTeam(team, done);
});

});

require.register("test/sports", function(exports, require, module) {
describe('Sports', function() {
  it('should be able to load all sports', function() {
    return expect(teamsnap.sports).to.be.an('array');
  });
  it('should be able to query sport for team', function(done) {
    return teamsnap.loadSports({
      teamId: team.id
    }, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      result.should.have.property('length', 1);
      result[0].should.have.property('type', 'sport');
      return done();
    });
  });
  return it('should be able to load sport for a team', function(done) {
    return teamsnap.loadSport(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('type', 'sport');
      return done();
    });
  });
});

});

require.register("test/teamPreferences", function(exports, require, module) {
describe('Team Preferences', function() {
  it('should be able to load preferences for teams', function(done) {
    return teamsnap.loadTeamsPreferences({
      userId: teamsnap.me.id
    }, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
  return it('should be able to load team preferences', function(done) {
    return teamsnap.loadTeamPreferences(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('type', 'teamPreferences');
      return done();
    });
  });
});

});

require.register("test/teamPublicSites", function(exports, require, module) {
describe('Team Public Sites', function() {
  return it('should be able to load team public site info', function(done) {
    return teamsnap.loadTeamPublicSite(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('type', 'teamPublicSite');
      return done();
    });
  });
});

});

require.register("test/teams", function(exports, require, module) {
describe('Teams', function() {
  var newTeam;
  newTeam = null;
  it('should be able to load all teams', function(done) {
    return teamsnap.loadTeams(function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
  it('should be able to load a teams data in bulk', function(done) {
    return teamsnap.bulkLoad(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
  it('should be able to create a new team', function(done) {
    newTeam = teamsnap.createTeam({
      name: 'New Test Team',
      sportId: 1,
      locationCountry: 'United States',
      locationPostalCode: 80302,
      timeZone: 'America/Denver'
    });
    return teamsnap.saveTeam(newTeam, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('type', 'team');
      result.should.have.property('id');
      result.should.equal(newTeam);
      return done();
    });
  });
  return it('should be able to delete a team', function(done) {
    return teamsnap.deleteTeam(newTeam, function(err, result) {
      expect(err).to.be["null"];
      return done();
    });
  });
});

});

require.register("test/trackedItemStatuses", function(exports, require, module) {
describe('Tracked Item Statuses', function() {
  return it('should be able to load all tracked item statuses for a team', function(done) {
    return teamsnap.loadTrackedItemStatuses(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/trackedItems", function(exports, require, module) {
describe('Tracked Items', function() {
  return it('should be able to load all tracked items for a team', function(done) {
    return teamsnap.loadTrackedItems(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

require.register("test/users", function(exports, require, module) {
describe('Users', function() {
  return it('should be able to load all users for team', function(done) {
    return teamsnap.loadUsers(team.id, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});

});

