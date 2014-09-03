(function() {
var window, global = {};
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
var require = global.require;
global = this;
if (global.window) window = this;
require.register("test/init", function(exports, require, module) {
var authButton, authSection, clientId, redirect, scopes, whenAuthFailed, whenAuthed;

mocha.setup('bdd');

window.require.list().filter(function(_) {
  return /^test/.test(_);
}).forEach(require);

mocha.checkLeaks();

authSection = document.getElementById('auth');

authButton = document.getElementById('auth-button');

clientId = '1d228d706ce170d61f9368b5967bd7a1641e6ecf742434dc198047f1a36a930a';

redirect = 'http://localhost:8000/test/';

scopes = ['read', 'write_contacts', 'write_contact_email_addresses', 'write_events', 'write_locations', 'write_opponents', 'write_refreshments', 'write_rosters', 'write_roster_email_addresses', 'write_rosters_preferences', 'write_teams', 'write_teams_preferences', 'write_teams_results', 'write_tracked_items', 'write_tracked_item_statuses'];

whenAuthed = function(sdk) {
  var teamsnap;
  authSection.parentNode.removeChild(authSection);
  teamsnap = sdk;
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
  teamsnap.auth().then(whenAuthed, whenAuthFailed);
} else {
  authButton.addEventListener('click', function() {
    var teamsnap;
    teamsnap.startBrowserAuth(redirect, scopes).then(function(sdk) {});
    authSection.parentNode.removeChild(authSection);
    teamsnap = sdk;
    return mocha.run();
  });
}
});

;
global['teamsnap'] = require('teamsnap');
})();
//# sourceMappingURL=test.js.map