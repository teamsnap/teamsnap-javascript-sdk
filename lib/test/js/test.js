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
require.register("test/availabilities", function(exports, require, module) {
describe('availabilities', function() {
  return it('should be able to load all availabilities for team', function(done) {
    return teamsnap.loadAvailabilities(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});
});

;require.register("test/contacts", function(exports, require, module) {
describe('contacts', function() {
  return it('should be able to load all contacts for team', function(done) {
    return teamsnap.loadContacts(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});
});

;require.register("test/events", function(exports, require, module) {
describe('events', function() {
  return it('should be able to load all events for team', function(done) {
    return teamsnap.loadEvents(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});
});

;require.register("test/init", function(exports, require, module) {
var authButton, authSection, clientId, collections, redirect, scopes, whenAuthFailed, whenAuthed;

chai.should();

window.expect = chai.expect;

authSection = document.getElementById('auth');

authButton = document.getElementById('auth-button');

clientId = '1d228d706ce170d61f9368b5967bd7a1641e6ecf742434dc198047f1a36a930a';

teamsnap.apiUrl = 'http://localhost:3000/';

redirect = 'http://localhost:8000/';

scopes = ['read', 'write_contacts', 'write_contact_email_addresses', 'write_events', 'write_locations', 'write_opponents', 'write_refreshments', 'write_rosters', 'write_roster_email_addresses', 'write_rosters_preferences', 'write_teams', 'write_teams_preferences', 'write_teams_results', 'write_tracked_items', 'write_tracked_item_statuses'];

whenAuthed = function(sdk) {
  authSection.parentNode.removeChild(authSection);
  sessionStorage.setItem('collections', JSON.stringify(sdk.collections));
  window.teamsnap = sdk;
  mocha.setup('bdd');
  window.require.list().filter(function(_) {
    return /^test/.test(_);
  }).forEach(require);
  mocha.checkLeaks();
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
describe('locations', function() {
  return it('should be able to load all locations for team', function(done) {
    return teamsnap.loadLocations(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});
});

;require.register("test/members", function(exports, require, module) {
describe('members', function() {
  return it('should be able to load all members for team', function(done) {
    return teamsnap.loadMembers(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});
});

;require.register("test/opponents", function(exports, require, module) {
describe('opponents', function() {
  return it('should be able to load all opponents for team', function(done) {
    return teamsnap.loadOpponents(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});
});

;require.register("test/plans", function(exports, require, module) {
describe('plans', function() {
  it('should be able to load all plans', function() {
    return expect(teamsnap.plans).to.be.an('array');
  });
  return it.skip('should be able to load plan for team', function(done) {
    return teamsnap.loadPlan(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('type', 'plan');
      return done();
    });
  });
});
});

;require.register("test/preferences", function(exports, require, module) {
describe('preferences', function() {
  it.skip('should be able to load preferences for member', function(done) {
    return teamsnap.loadMemberPreferences(1, function(err, results) {
      expect(err).to.be["null"];
      results.should.have.property('type', 'memberPreferences');
      return done();
    });
  });
  it('should be able to load preferences for team', function(done) {
    return teamsnap.loadTeamPreferences(1, function(err, results) {
      expect(err).to.be["null"];
      results.should.have.property('type', 'TeamPreferences');
      return done();
    });
  });
  return it.skip('should be able to load all preferences', function(done) {
    return teamsnap.loadPreferences(1, function(err, memberPrefs, teamPrefs) {
      expect(err).to.be["null"];
      memberPrefs.should.have.property('type', 'memberPreferences');
      teamPrefs.should.have.property('type', 'teamPreferences');
      return done();
    });
  });
});
});

;require.register("test/refreshments", function(exports, require, module) {
describe('refreshments', function() {
  return it.skip('should be able to load all refreshments for team', function(done) {
    return teamsnap.loadRefreshments(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});
});

;require.register("test/sports", function(exports, require, module) {
describe('sports', function() {
  it('should be able to load all sports', function() {
    return expect(teamsnap.sports).to.be.an('array');
  });
  return it.skip('should be able to load sport for a team', function(done) {
    return teamsnap.loadSport(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('type', 'sport');
      return done();
    });
  });
});
});

;require.register("test/teamPublicSites", function(exports, require, module) {
describe.skip('team public sites', function() {
  return it('should be able to load a team\'s public site info', function(done) {
    return teamsnap.loadTeamPublicSite(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.have.property('type', 'teamPublicSite');
      return done();
    });
  });
});
});

;require.register("test/teams", function(exports, require, module) {
describe('teams', function() {
  return it('should be able to load all teams', function(done) {
    return teamsnap.loadTeams(function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});
});

;require.register("test/tracking", function(exports, require, module) {
describe('tracking', function() {
  it('should be able to load all tracked items for a team', function(done) {
    return teamsnap.loadTrackedItems(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
  return it.skip('should be able to load all tracked item statuses for a team', function(done) {
    return teamsnap.loadTrackedItemStatuses(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});
});

;require.register("test/users", function(exports, require, module) {
describe('users', function() {
  return it('should be able to load all users for team', function(done) {
    return teamsnap.loadUsers(1, function(err, result) {
      expect(err).to.be["null"];
      result.should.be.an('array');
      return done();
    });
  });
});
});

;
//# sourceMappingURL=test.js.map