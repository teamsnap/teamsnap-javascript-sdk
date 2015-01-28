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
require.register("auth", function(exports, require, module) {
var TeamSnap, authRequest, browserStorageName, browserStore, collectionJSONMime, createAuthDialog, jsonMime, multipartMime, promises, request, sdkRequest;

TeamSnap = require('./teamsnap').TeamSnap;

request = require('./request');

promises = require('./promises');

request = require('./request');

jsonMime = 'application/json';

collectionJSONMime = 'application/vnd.collection+json';

multipartMime = 'multipart/form-data';

browserStorageName = 'teamsnap.authToken';

authRequest = request.create().hook(function(xhr, data) {
  xhr.setRequestHeader('Accept', jsonMime);
  if (data) {
    xhr.setRequestHeader('Content-Type', jsonMime);
  }
  return xhr.withCredentials = true;
});

sdkRequest = request.create().hook(function(xhr, data) {
  xhr.setRequestHeader('Accept', collectionJSONMime);
  if (data && !(data instanceof FormData)) {
    xhr.setRequestHeader('Content-Type', collectionJSONMime);
  }
  return xhr.withCredentials = true;
});

TeamSnap.prototype.auth = function(token) {
  var cachedCollections, callback;
  if (typeof token === 'function') {
    callback = token;
    token = null;
  } else if (typeof token === 'object') {
    callback = cachedCollections;
    cachedCollections = token;
    token = null;
  }
  if (typeof cachedCollections === 'function') {
    callback = cachedCollections;
    cachedCollections = null;
  }
  this.request = sdkRequest.clone();
  if (typeof token === 'number' && teamsnap.apiUrl.indexOf(':3000') !== -1) {
    this.request.hook(function(xhr) {
      return xhr.setRequestHeader('X-Teamsnap-User-ID', token);
    });
    return this;
  }
  if (!token) {
    token = browserStore();
  }
  if (!token) {
    throw new TSArgsError('teamsnap.auth', 'A token is required to auth unless in the browser it has been cached');
  }
  this.request.hook(function(xhr) {
    return xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  });
  return this;
};

TeamSnap.prototype.deleteAuth = function() {
  return this.request = null;
};

TeamSnap.prototype.isAuthed = function() {
  return !!this.request;
};

TeamSnap.prototype.hasSession = function() {
  return !!browserStore();
};

TeamSnap.prototype.init = function(clientId, secret) {
  var generateAuthUrl, generatePasswordUrl, generateTokenUrl, generateUrl;
  generateUrl = function(endpoint, params) {
    var key, queries, url, value;
    queries = [];
    for (key in params) {
      value = params[key];
      if (value) {
        queries.push(key + '=' + encodeURIComponent(value));
      }
    }
    url = teamsnap.authUrl + '/oauth/' + endpoint + '?' + queries.join('&');
    return url.replace(/%20/g, '+');
  };
  generateAuthUrl = function(type, redirect, scopes) {
    scopes = Array.isArray(scopes) ? scopes.join(' ') : scopes;
    return generateUrl('authorize', {
      response_type: type,
      client_id: clientId,
      redirect_uri: redirect,
      scope: scopes
    });
  };
  generateTokenUrl = function(code) {
    return generateUrl('token', {
      grant_type: 'authorization_code',
      code: code,
      client_id: clientId,
      client_secret: secret
    });
  };
  generatePasswordUrl = function(username, password) {
    return generateUrl('token', {
      grant_type: 'password',
      username: username,
      password: password,
      client_id: clientId,
      client_secret: secret
    });
  };
  this.getServerAuthUrl = function(redirect, scopes) {
    return generateAuthUrl('code', redirect, scopes);
  };
  this.getServerTokenUrl = function(code) {
    return generateTokenUrl(code);
  };
  this.getBrowserAuthUrl = function(redirect, scopes) {
    return generateAuthUrl('token', redirect, scopes);
  };
  this.getPasswordAuthUrl = function(username, password) {
    return generatePasswordUrl(username, password);
  };
  this.createDialog = function(url, callback) {
    return createAuthDialog(url, callback);
  };
  this.finishServerAuth = function(code, callback) {
    return authRequest.post(this.getServerTokenUrl(code), callback);
  };
  this.startBrowserAuth = function(redirect, scopes, callback) {
    if (location.protocol === 'file:') {
      throw new TSError('TeamSnap.js cannot auth from the file system');
    }
    return this.createDialog(this.getBrowserAuthUrl(redirect, scopes)).then((function(_this) {
      return function(response) {
        var token;
        token = response.access_token;
        browserStore(token);
        return _this.auth(token);
      };
    })(this)).callback(callback);
  };
  return this.startPasswordAuth = function(username, password, callback) {
    return authRequest.post(this.getPasswordAuthUrl(username, password), callback);
  };
};

browserStore = function(token) {
  if (!global.sessionStorage) {
    return;
  }
  if (arguments.length === 0) {
    return sessionStorage.getItem(browserStorageName);
  } else {
    sessionStorage.setItem(browserStorageName, token);
  }
};

createAuthDialog = function(url, callback) {
  var deferred, dialog, height, interval, left, top, width, windowHeight, windowWidth, x, y;
  width = 860;
  height = 720;
  deferred = promises.defer();
  x = window.screenLeft || window.screenX;
  y = window.screenTop || window.screenY;
  windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  left = x + (windowWidth - width) / 2;
  top = y + (windowHeight - height) / 2;
  dialog = window.open(url, 'oauth', 'menubar=no,scrollbars=no,status=no,toolbar=no,' + 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
  interval = setInterval(function() {
    var e, params, response;
    try {
      if (dialog.closed) {
        clearInterval(interval);
        deferred.reject({
          error: 'access_denied',
          error_description: 'The resource owner denied the request.'
        });
      }
      if (dialog.location.host !== location.host) {
        return;
      }
      params = dialog.location.hash.replace(/^#/, '') || dialog.location.search.replace(/^\?/, '');
    } catch (_error) {
      e = _error;
      return;
    }
    clearInterval(interval);
    dialog.close();
    response = {};
    params.split('&').forEach(function(param) {
      var key, value, _ref;
      _ref = param.split('='), key = _ref[0], value = _ref[1];
      return response[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
    });
    if (response.error) {
      return deferred.reject(response);
    } else {
      return deferred.resolve(response);
    }
  }, 50);
  return deferred.promise.callback(callback);
};

});

require.register("collections/assignments", function(exports, require, module) {
exports.loadAssignments = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadAssignments', 'must provide a teamId or query parameters');
  }
  return this.loadItems('assignment', params, callback);
};

exports.createAssignment = function(data) {
  return this.createItem(data, {
    type: 'assignment',
    description: ''
  });
};

exports.saveAssignment = function(assignment, callback) {
  var _ref;
  if (!assignment) {
    throw new TSArgsError('teamsnap.saveAssignment', "`assignment` must be provided");
  }
  if (!this.isItem(assignment, 'assignment')) {
    throw new TSArgsError('teamsnap.saveAssignment', "`assignment.type` must be 'assignment'");
  }
  if (!assignment.memberId) {
    return this.reject('You must choose a member.', 'memberId', callback);
  }
  if (!assignment.eventId) {
    return this.reject('You must choose an event.', 'eventId', callback);
  }
  if (!((_ref = assignment.description) != null ? _ref.trim() : void 0)) {
    return this.reject('You must provide a description for the assignment.', 'name', callback);
  }
  return this.saveItem(assignment, callback);
};

exports.deleteAssignment = function(assignment, callback) {
  if (!assignment) {
    throw new TSArgsError('teamsnap.deleteAssignment', '`assignment` must be provided');
  }
  return this.deleteItem(assignment, callback);
};

exports.getAssignmentSort = function(reverse) {
  return (function(_this) {
    return function(itemA, itemB) {
      var valueA, valueB;
      if (!_this.isItem(itemA, 'assignment') || !_this.isItem(itemB, 'assignment')) {
        valueA = itemA.type;
        valueB = itemB.type;
      } else {
        valueA = _this.memberName(itemA.member, reverse).toLowerCase();
        valueB = _this.memberName(itemB.member, reverse).toLowerCase();
      }
      if (valueA === valueB) {
        return 0;
      } else if (!valueA && valueB) {
        return 1;
      } else if (valueA && !valueB) {
        return -1;
      } else if (valueA > valueB) {
        return 1;
      } else if (valueA < valueB) {
        return -1;
      } else {
        return 0;
      }
    };
  })(this);
};

});

require.register("collections/availabilities", function(exports, require, module) {
var key, statuses, value, _ref;

exports.AVAILABILITIES = {
  NONE: null,
  NO: 0,
  YES: 1,
  MAYBE: 2
};

statuses = {};

_ref = exports.AVAILABILITIES;
for (key in _ref) {
  value = _ref[key];
  statuses[value] = true;
}

exports.loadAvailabilities = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadAvailabilities', 'must provide a teamId or query parameters');
  }
  return this.loadItems('availability', params, callback);
};

exports.saveAvailability = function(availability, callback) {
  if (!availability) {
    throw new TSArgsError('teamsnap.saveAvailability', "`availability` must be provided");
  }
  if (!this.isItem(availability, 'availability')) {
    throw new TSArgsError('teamsnap.saveAvailability', "`type` must be 'availability'");
  }
  if (availability.statusCode !== null && !statuses[availability.statusCode]) {
    return this.reject('You must select a valid status or null', 'statusCode', callback);
  }
  return this.saveItem(availability, callback);
};

exports.bulkMarkUnsetAvailabilities = function(memberId, statusCode, callback) {
  var params;
  if (!this.isId(memberId)) {
    throw new TSArgsError('teamsnap.bulkMarkUnsetAvailabilities', "must provide a `memberId`");
  }
  if (!((statusCode != null) && statuses[statusCode])) {
    return this.reject('You must select a valid status', 'statusCode', callback);
  }
  params = {
    memberId: memberId,
    statusCode: statusCode
  };
  return this.collections.availabilities.exec('bulkMarkUnsetAvailabilities', params).pop().callback(callback);
};

});

require.register("collections/contactEmailAddresses", function(exports, require, module) {
exports.loadContactEmailAddresses = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadContactEmailAddresses', 'must provide a teamId or query parameters');
  }
  return this.loadItems('contactEmailAddress', params, callback);
};

exports.createContactEmailAddress = function(data) {
  return this.createItem(data, {
    type: 'contactEmailAddress',
    receivesTeamEmails: true
  });
};

exports.saveContactEmailAddress = function(emailAddress, callback) {
  if (!emailAddress) {
    throw new TSArgsError('teamsnap.saveContactEmailAddress', '`emailAddress` must be provided');
  }
  if (!this.isItem(emailAddress, 'contactEmailAddress')) {
    throw new TSArgsError('teamsnap.saveContactEmailAddress', "`emailAddress.type` must be 'contactEmailAddress'");
  }
  if (!emailAddress.contactId) {
    return this.reject('You must choose a contact.', 'contactId', callback);
  }
  return this.saveItem(emailAddress, callback);
};

exports.deleteContactEmailAddress = function(emailAddress, callback) {
  if (!emailAddress) {
    throw new TSArgsError('teamsnap.deleteContactEmailAddress', '`emailAddress` must be provided');
  }
  return this.deleteItem(emailAddress, callback);
};

});

require.register("collections/contactPhoneNumbers", function(exports, require, module) {
exports.loadContactPhoneNumbers = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadContactPhoneNumbers', 'must provide a teamId or query parameters');
  }
  return this.loadItems('contactPhoneNumber', params, callback);
};

exports.createContactPhoneNumber = function(data) {
  return this.createItem(data, {
    type: 'contactPhoneNumber'
  });
};

exports.saveContactPhoneNumber = function(phoneNumber, callback) {
  if (!phoneNumber) {
    throw new TSArgsError('teamsnap.saveContactPhoneNumber', '`phoneNumber` must be provided');
  }
  if (!this.isItem(phoneNumber, 'contactPhoneNumber')) {
    throw new TSArgsError('teamsnap.saveContactPhoneNumber', "`phoneNumber.type` must be 'contactPhoneNumber'");
  }
  if (!phoneNumber.contactId) {
    return this.reject('You must choose a contact.', 'contactId', callback);
  }
  return this.saveItem(phoneNumber, callback);
};

exports.deleteContactPhoneNumber = function(phoneNumber, callback) {
  if (!phoneNumber) {
    throw new TSArgsError('teamsnap.deleteContactPhoneNumber', '`phoneNumber` must be provided');
  }
  return this.deleteItem(phoneNumber, callback);
};

});

require.register("collections/contacts", function(exports, require, module) {
exports.loadContacts = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadContacts', 'must provide a teamId or query parameters');
  }
  return this.loadItems('contact', params, callback);
};

exports.createContact = function(data) {
  return this.createItem(data, {
    type: 'contact'
  });
};

exports.saveContact = function(contact, callback) {
  var _ref;
  if (!contact) {
    throw new TSArgsError('teamsnap.saveContact', "`contact` must be provided");
  }
  if (!this.isItem(contact, 'contact')) {
    throw new TSArgsError('teamsnap.saveContact', "`contact.type` must be 'contact'");
  }
  if (!contact.memberId) {
    return this.reject('You must choose a member.', 'memberId', callback);
  }
  if (!((_ref = contact.firstName) != null ? _ref.trim() : void 0)) {
    return this.reject('You must provide a firstName for the contact.', 'name', callback);
  }
  return this.saveItem(contact, callback);
};

exports.deleteContact = function(contact, callback) {
  if (!contact) {
    throw new TSArgsError('teamsnap.deleteContact', '`contact` must be provided');
  }
  return this.deleteItem(contact, callback);
};

});

require.register("collections/customData", function(exports, require, module) {
exports.loadCustomData = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadCustomData', 'must provide a teamId or query parameters');
  }
  return this.loadItems('customDatum', params, callback);
};

exports.saveCustomDatum = function(customDatum, callback) {
  if (!customDatum) {
    throw new TSArgsError('teamsnap.saveCustomField', '`customDatum` must be provided');
  }
  if (!this.isItem(customDatum, 'customDatum')) {
    throw new TSArgsError('teamsnap.saveCustomField', "`customDatum.type` must be 'customDatum'");
  }
  return this.saveItem(customDatum, callback);
};

});

require.register("collections/customFields", function(exports, require, module) {
exports.loadCustomFields = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadCustomFields', 'must provide a teamId or query parameters');
  }
  return this.loadItems('customField', params, callback);
};

exports.createCustomField = function(data) {
  return this.createItem(data, {
    type: 'customField'
  });
};

exports.saveCustomField = function(customField, callback) {
  if (!customField) {
    throw new TSArgsError('teamsnap.saveCustomField', '`customField` must be provided');
  }
  if (!this.isItem(customField, 'customField')) {
    throw new TSArgsError('teamsnap.saveCustomField', "`customField.type` must be 'customField'");
  }
  if (!customField.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!customField.name) {
    return this.reject('You must enter a name.', 'name', callback);
  }
  if (!customField.kind) {
    return this.reject('You must choose a type.', 'kind', callback);
  }
  return this.saveItem(customField, callback);
};

exports.deleteCustomField = function(customField, callback) {
  if (!customField) {
    throw new TSArgsError('teamsnap.deleteCustomField', '`customField` must be provided');
  }
  return this.deleteItem(customField, callback);
};

});

require.register("collections/events", function(exports, require, module) {
var includes, key, value, _ref;

exports.EVENTS = {
  NONE: 'none',
  FUTURE: 'future',
  ALL: 'all'
};

exports.REMINDERS = {
  ALL: 'all',
  UNSET: 'unset'
};

includes = {};

_ref = exports.EVENTS;
for (key in _ref) {
  value = _ref[key];
  includes[value] = true;
}

exports.loadEvents = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadEvents', 'must provide a teamId or query parameters');
  }
  return this.loadItems('event', params, callback);
};

exports.createEvent = function(data) {
  return this.createItem(data, {
    type: 'event',
    isGame: false,
    tracksAvailability: true
  });
};

exports.saveEvent = function(event, callback) {
  var _ref1, _ref2;
  if (!event) {
    throw new TSArgsError('teamsnap.saveEvent', "`event` must be provided");
  }
  if (!this.isItem(event, 'event')) {
    throw new TSArgsError('teamsnap.saveEvent', "`event.type` must be 'event'");
  }
  if (!(event.isGame || ((_ref1 = event.name) != null ? _ref1.trim() : void 0))) {
    return this.reject('You must provide a name.', 'name', callback);
  }
  if (!event.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!event.locationId) {
    return this.reject('You must choose a location.', 'locationId', callback);
  }
  if (event.isGame && !event.opponentId) {
    return this.reject('You must choose an opponent.', 'opponentId', callback);
  }
  if (isNaN((_ref2 = event.startDate) != null ? _ref2.getTime() : void 0)) {
    return this.reject('You must provide a valid start date.', 'startDate', callback);
  }
  return this.saveItem(event, callback);
};

exports.deleteEvent = function(event, include, notify, callback) {
  var params;
  params = {};
  if (!event) {
    throw new TSArgsError('teamsnap.deleteEvent', '`event` must be provided');
  }
  if (typeof include === 'function') {
    callback = include;
    include = null;
  }
  if (!include && event.repeatingUuid) {
    include = this.EVENTS.NONE;
  }
  if (include) {
    if (!includes[include]) {
      throw new TSArgsError('teamsnap.deleteEvent', "`include` must be one of " + (Object.keys(includes).join(', ')));
    }
    params.repeatingInclude = include;
  }
  if (notify) {
    params.notifyTeam = notify;
  }
  return this.deleteItem(event, params, callback);
};

exports.sendAvailabilityReminders = function(eventId, sendingMemberId, include) {
  var options;
  if (!include) {
    include = [];
  }
  if (this.isItem(eventId, 'event')) {
    eventId = eventId.id;
  }
  if (this.isItem(sendingMemberId, 'member')) {
    sendingMemberId = sendingMemberId.id;
  }
  if (!this.isId(eventId)) {
    throw new TSArgsError('teamsnap.sendAvailabilityReminders', 'must include id `eventId`');
  }
  if (!this.isId(sendingMemberId)) {
    throw new TSArgsError('teamsnap.sendAvailabilityReminders', 'must include id `sendingMemberId`');
  }
  if (!Array.isArray(include)) {
    throw new TSArgsError('teamsnap.sendAvailabilityReminders', "`include` must be an array of user ids");
  }
  if ((include == null) || include.length === 0) {
    throw new TSArgsError('teamsnap.sendAvailabilityReminders', "`include` must be an array of user ids");
  }
  options = {
    id: eventId,
    membersToNotify: include,
    notifyTeamAsMemberId: sendingMemberId
  };
  return this.collections.events.exec('sendAvailabilityReminders', options);
};

exports.getEventSort = function() {
  return (function(_this) {
    return function(itemA, itemB) {
      var valueA, valueB;
      if (!_this.isItem(itemA, 'event') || !_this.isItem(itemB, 'event')) {
        valueA = itemA.type;
        valueB = itemB.type;
      } else {
        valueA = itemA.startDate;
        valueB = itemB.startDate;
      }
      if (valueA > valueB) {
        return 1;
      } else if (valueA < valueB) {
        return -1;
      } else {
        return 0;
      }
    };
  })(this);
};

});

require.register("collections/locations", function(exports, require, module) {
exports.loadLocations = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadLocations', 'must provide a teamId or query parameters');
  }
  return this.loadItems('location', params, callback);
};

exports.createLocation = function(data) {
  return this.createItem(data, {
    type: 'location',
    name: ''
  });
};

exports.saveLocation = function(location, callback) {
  var _ref;
  if (!location) {
    throw new TSArgsError('teamsnap.saveLocation', "`location` must be provided");
  }
  if (!this.isItem(location, 'location')) {
    throw new TSArgsError('teamsnap.saveLocation', "`location.type` must be 'location'");
  }
  if (!location.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!((_ref = location.name) != null ? _ref.trim() : void 0)) {
    return this.reject('You must provide a name for the location.', 'name', callback);
  }
  return this.saveItem(location, callback);
};

exports.deleteLocation = function(location, callback) {
  if (!location) {
    throw new TSArgsError('teamsnap.deleteLocation', '`location` must be provided');
  }
  return this.deleteItem(location, callback);
};

});

require.register("collections/memberEmailAddresses", function(exports, require, module) {
exports.loadMemberEmailAddresses = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberEmailAddresses', 'must provide a teamId or query parameters');
  }
  return this.loadItems('memberEmailAddress', params, callback);
};

exports.createMemberEmailAddress = function(data) {
  return this.createItem(data, {
    type: 'memberEmailAddress',
    receivesTeamEmails: true
  });
};

exports.saveMemberEmailAddress = function(emailAddress, callback) {
  if (!emailAddress) {
    throw new TSArgsError('teamsnap.saveMemberEmailAddress', '`emailAddress` must be provided');
  }
  if (!this.isItem(emailAddress, 'memberEmailAddress')) {
    throw new TSArgsError('teamsnap.saveMemberEmailAddress', "`emailAddress.type` must be 'memberEmailAddress'");
  }
  if (!emailAddress.memberId) {
    return this.reject('You must choose a member.', 'memberId', callback);
  }
  return this.saveItem(emailAddress, callback);
};

exports.deleteMemberEmailAddress = function(emailAddress, callback) {
  if (!emailAddress) {
    throw new TSArgsError('teamsnap.deleteMemberEmailAddress', '`emailAddress` must be provided');
  }
  return this.deleteItem(emailAddress, callback);
};

});

require.register("collections/memberFiles", function(exports, require, module) {
exports.loadMemberFiles = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberFiles', 'must provide a teamId or query parameters');
  }
  return this.loadItems('memberFile', params, callback);
};

exports.createMemberFile = function(data) {
  return this.createItem(data, {
    type: 'memberFile'
  });
};

exports.saveMemberFile = function(memberFile, callback) {
  if (!memberFile) {
    throw new TSArgsError('teamsnap.saveMemberFile', '`memberFile` must be provided');
  }
  if (!this.isItem(memberFile, 'memberFile')) {
    throw new TSArgsError('teamsnap.saveMemberFile', "`memberFile.type` must be 'memberFile'");
  }
  if (!memberFile.memberId) {
    return this.reject('You must choose a member.', 'memberId', callback);
  }
  return this.saveItem(memberFile, callback);
};

exports.deleteMemberFile = function(memberFile, callback) {
  if (!memberFile) {
    throw new TSArgsError('teamsnap.deleteMemberFile', '`memberFile` must be provided');
  }
  return this.deleteItem(memberFile, callback);
};

exports.uploadMemberFile = function(memberFileId, file, callback) {
  var params;
  if (this.isItem(memberFileId, 'memberFile')) {
    memberFileId = memberFileId.id;
  }
  if (typeof FormData === 'undefined') {
    this.reject('Your browser does not support the new file upload APIs.', 'file', callback);
  }
  if (!this.isId(memberFileId)) {
    throw new TSArgsError('teamsnap.uploadMemberFile', 'must include `memberFileId`');
  }
  if (!(file instanceof File)) {
    throw new TSArgsError('teamsnap.uploadMemberFile', 'must include `file` as type File');
  }
  params = {
    memberFileId: memberFileId,
    file: file
  };
  return this.collections.memberFiles.exec('uploadMemberFile', params).pop().callback(callback);
};

});

require.register("collections/memberLinks", function(exports, require, module) {
exports.loadMemberLinks = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberLinks', 'must provide a teamId or query parameters');
  }
  return this.loadItems('memberLink', params, callback);
};

exports.createMemberLink = function(data) {
  return this.createItem(data, {
    type: 'memberLink'
  });
};

exports.saveMemberLink = function(memberLink, callback) {
  if (!memberLink) {
    throw new TSArgsError('teamsnap.saveMemberLink', '`memberLink` must be provided');
  }
  if (!this.isItem(memberLink, 'memberLink')) {
    throw new TSArgsError('teamsnap.saveMemberLink', "`memberLink.type` must be 'memberLink'");
  }
  if (!memberLink.memberId) {
    return this.reject('You must choose a member.', 'memberId', callback);
  }
  return this.saveItem(memberLink, callback);
};

exports.deleteMemberLink = function(memberLink, callback) {
  if (!memberLink) {
    throw new TSArgsError('teamsnap.deleteMemberLink', '`memberLink` must be provided');
  }
  return this.deleteItem(memberLink, callback);
};

});

require.register("collections/memberPhoneNumbers", function(exports, require, module) {
exports.loadMemberPhoneNumbers = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberPhoneNumbers', 'must provide a teamId or query parameters');
  }
  return this.loadItems('memberPhoneNumber', params, callback);
};

exports.createMemberPhoneNumber = function(data) {
  return this.createItem(data, {
    type: 'memberPhoneNumber'
  });
};

exports.saveMemberPhoneNumber = function(phoneNumber, callback) {
  if (!phoneNumber) {
    throw new TSArgsError('teamsnap.saveMemberPhoneNumber', '`phoneNumber` must be provided');
  }
  if (!this.isItem(phoneNumber, 'memberPhoneNumber')) {
    throw new TSArgsError('teamsnap.saveMemberPhoneNumber', "`phoneNumber.type` must be 'memberPhoneNumber'");
  }
  if (!phoneNumber.memberId) {
    return this.reject('You must choose a member.', 'memberId', callback);
  }
  return this.saveItem(phoneNumber, callback);
};

exports.deleteMemberPhoneNumber = function(phoneNumber, callback) {
  if (!phoneNumber) {
    throw new TSArgsError('teamsnap.deleteMemberPhoneNumber', '`phoneNumber` must be provided');
  }
  return this.deleteItem(phoneNumber, callback);
};

});

require.register("collections/memberPreferences", function(exports, require, module) {
exports.PREFS = {
  SCHEDULE_SHOW: {
    ALL: 1,
    GAMES: 2,
    EVENTS: 3
  }
};

exports.loadMembersPreferences = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMembersPreferences', 'must provide a teamId or query parameters');
  }
  return this.loadItems('memberPreferences', params, callback);
};

exports.loadMemberPreferences = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberPreferences', 'must provide a teamId or query parameters');
  }
  return this.loadItem('memberPreferences', params, callback);
};

exports.saveMemberPreferences = function(memberPreferences, callback) {
  if (!memberPreferences) {
    throw new TSArgsError('teamsnap.saveMemberPreferences', "`memberPreferences` must be provided");
  }
  if (!this.isItem(memberPreferences, 'memberPreferences')) {
    throw new TSArgsError('teamsnap.saveMemberPreferences', "`memberPreferences.type` must be 'memberPreferences'");
  }
  return this.saveItem(memberPreferences, callback);
};

exports.saveTeamPreferences = function(teamPreferences, callback) {
  if (!teamPreferences) {
    throw new TSArgsError('teamsnap.saveTeamPreferences', "`teamPreferences` must be provided");
  }
  if (!this.isItem(teamPreferences, 'teamPreferences')) {
    throw new TSArgsError('teamsnap.saveTeamPreferences', "`teamPreferences.type` must be 'teamPreferences'");
  }
  return this.saveItem(teamPreferences, callback);
};

});

require.register("collections/members", function(exports, require, module) {
exports.loadMembers = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMembers', 'must provide a teamId or query parameters');
  }
  return this.loadItems('member', params, callback);
};

exports.createMember = function(data) {
  return this.createItem(data, {
    type: 'member'
  });
};

exports.saveMember = function(member, callback) {
  var _ref;
  if (!member) {
    throw new TSArgsError('teamsnap.saveMember', "`member` must be provided");
  }
  if (!this.isItem(member, 'member')) {
    throw new TSArgsError('teamsnap.saveMember', "`type` must be 'member'");
  }
  if (!member.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!((_ref = member.firstName) != null ? _ref.trim() : void 0)) {
    return this.reject('You must provide a first name for the member.', 'name', callback);
  }
  return this.saveItem(member, callback);
};

exports.deleteMember = function(member, callback) {
  if (!member) {
    throw new TSArgsError('teamsnap.deleteMember', '`member` must be provided');
  }
  return this.deleteItem(member, callback);
};

exports.uploadMemberPhoto = function(memberId, file, callback) {
  var params;
  if (this.isItem(memberId, 'member')) {
    memberId = memberId.id;
  }
  if (typeof FormData === 'undefined') {
    this.reject('Your browser does not support the new file upload APIs.', 'file', callback);
  }
  if (!this.isId(memberId)) {
    throw new TSArgsError('teamsnap.deleteMemberPhoto', "`memberId` must be a valid id");
  }
  if (!(file instanceof File)) {
    throw new TSArgsError('teamsnap.uploadMemberFile', 'must include `file` as type File');
  }
  params = {
    memberId: memberId,
    file: file
  };
  return this.collections.members.exec('uploadMemberPhoto', params).pop().callback(callback);
};

exports.removeMemberPhoto = function(memberId, callback) {
  var params;
  if (this.isItem(memberId, 'member')) {
    memberId = memberId.id;
  }
  if (!this.isId(memberId)) {
    throw new TSArgsError('teamsnap.deleteMemberPhoto', "`memberId` must be a valid id");
  }
  params = {
    memberId: memberId
  };
  return this.collections.members.exec('removeMemberPhoto', params).pop().callback(callback);
};

exports.generateMemberThumbnail = function(memberId, x, y, width, height, callback) {
  var params;
  if (this.isItem(memberId, 'member')) {
    memberId = memberId.id;
  }
  if (!((memberId != null) && (x != null) && (y != null) && (width != null) && (height != null))) {
    throw new TSArgsError('teamsnap.generateThumbnail', "`memberId`, `x`, `y`, `width`, and `height` are all required");
  }
  if (!this.isId(memberId)) {
    throw new TSArgsError('teamsnap.generateMemberThumbnail', "`memberId` must be a valid id");
  }
  params = {
    memberId: memberId,
    x: x,
    y: y,
    width: width,
    height: height
  };
  return this.collections.members.exec('generateMemberThumbnail', params).pop().callback(callback);
};

exports.disableMember = function(memberId, callback) {
  var params;
  if (this.isItem(memberId, 'member')) {
    memberId = memberId.id;
  }
  if (!this.isId(memberId)) {
    throw new TSArgsError('teamsnap.disableMember', "`memberId` must be a valid id");
  }
  params = {
    memberId: memberId
  };
  return this.collections.members.exec('disableMember', params).pop().callback(callback);
};

exports.memberName = function(member, reverse, forSort) {
  if (!member) {
    return '';
  }
  if (reverse && (member.firstName && member.lastName || forSort)) {
    return member.lastName + ', ' + member.firstName;
  }
  return [member.firstName || '', member.lastName || ''].join(' ').trim();
};

exports.getMemberSort = function(reverse) {
  return (function(_this) {
    return function(itemA, itemB) {
      var valueA, valueB;
      if (!_this.isItem(itemA, 'member') || !_this.isItem(itemB, 'member')) {
        valueA = itemA.type;
        valueB = itemB.type;
      } else {
        valueA = _this.memberName(itemA, reverse, true).toLowerCase();
        valueB = _this.memberName(itemB, reverse, true).toLowerCase();
      }
      if (valueA === valueB) {
        return 0;
      } else if (!valueA && valueB) {
        return 1;
      } else if (valueA && !valueB) {
        return -1;
      } else if (valueA > valueB) {
        return 1;
      } else if (valueA < valueB) {
        return -1;
      } else {
        return 0;
      }
    };
  })(this);
};

exports.canEditTeam = function(member, team) {
  if (!(member && team)) {
    return false;
  }
  return (member.isManager || member.isOwner) && (!team.isArchivedSeason || member.isOwner);
};

exports.canEditItem = function(member, team, item) {
  if (!(member && team && this.isItem(item))) {
    return false;
  }
  if (item.readOnly) {
    return false;
  }
  if (teamsnap.canEditTeam(member, team)) {
    return true;
  }
  if (team.isArchivedSeason) {
    return false;
  }
  if (this.isItem(item, 'member')) {
    return item.href === member.href;
  } else {
    return item.links.member.href === member.href;
  }
};

});

require.register("collections/opponentResults", function(exports, require, module) {
exports.loadOpponentsResults = function(params, callback) {
  if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadOpponentsResults', 'must provide query parameters');
  }
  return this.loadItems('opponentResults', params, callback);
};

exports.loadOpponentResults = function(opponentId, callback) {
  var params;
  if (!this.isId(opponentId)) {
    throw new TSArgsError('teamsnap.loadOpponentResults', 'must provide an opponentId');
  }
  params = {
    id: opponentId
  };
  return this.loadItem('opponentResults', params, callback);
};

});

require.register("collections/opponents", function(exports, require, module) {
exports.loadOpponents = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadOpponents', 'must provide a teamId or query parameters');
  }
  return this.loadItems('opponent', params, callback);
};

exports.createOpponent = function(data) {
  return this.createItem(data, {
    type: 'opponent',
    name: ''
  });
};

exports.saveOpponent = function(opponent, callback) {
  var _ref;
  if (!opponent) {
    throw new TSArgsError('teamsnap.saveOpponent', "`opponent` must be provided");
  }
  if (!this.isItem(opponent, 'opponent')) {
    throw new TSArgsError('teamsnap.saveOpponent', "`opponent.type` must be 'opponent'");
  }
  if (!opponent.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!((_ref = opponent.name) != null ? _ref.trim() : void 0)) {
    return this.reject('You must provide a name for the opponent.', 'name', callback);
  }
  return this.saveItem(opponent, callback);
};

exports.deleteOpponent = function(opponent, callback) {
  if (!opponent) {
    throw new TSArgsError('teamsnap.deleteOpponent', '`opponent` must be provided');
  }
  return this.deleteItem(opponent, callback);
};

});

require.register("collections/plans", function(exports, require, module) {
exports.loadPlans = function(params, callback) {
  if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadPlans', 'must provide query parameters');
  }
  return this.loadItems('plan', params, callback);
};

exports.loadPlan = function(teamId, callback) {
  var params;
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.loadPlan', 'must provide a teamId');
  }
  params = {
    teamId: teamId
  };
  return this.loadItem('plan', params, callback);
};

});

require.register("collections/sponsors", function(exports, require, module) {
exports.createSponsor = function(data) {
  return this.createItem(data, {
    type: 'sponsor',
    name: ''
  });
};

exports.saveSponsor = function(sponsor, callback) {
  if (!sponsor) {
    throw new TSArgsError('teamsnap.saveSponsor', "`sponsor` must be provided");
  }
  if (!this.isItem(sponsor, 'sponsor')) {
    throw new TSArgsError('teamsnap.saveSponsor', "`sponsor.type` must be 'sponsor'");
  }
  return this.saveItem(sponsor, callback);
};

exports.deleteSponsor = function(sponsor, callback) {
  if (!sponsor) {
    throw new TSArgsError('teamsnap.deleteSponsor', "`sponsor` must be provided");
  }
  return this.deleteItem(sponsor, callback);
};

exports.uploadSponsorLogo = function(sponsorId, file, callback) {
  var params;
  if (this.isItem(sponsorId, 'sponsor')) {
    sponsorId = sponsorId.id;
  }
  if (typeof FormData === 'undefined') {
    this.reject('Your browser does not support the new file upload APIs.', 'file', callback);
  }
  if (!this.isId(sponsorId)) {
    throw new TSArgsError('teamsnap.uploadSponsorLogo', 'must include `sponsorId`');
  }
  if (!(file instanceof File)) {
    throw new TSArgsError('teamsnap.uploadSponsorLogo', 'must include `file` as type File');
  }
  params = {
    sponsorId: sponsorId,
    file: file
  };
  return this.collections.sponsors.exec('uploadSponsorLogo', params).pop().callback(callback);
};

exports.deleteSponsorLogo = function(sponsorId, callback) {
  var params;
  if (!sponsorId) {
    throw new TSArgsError('teamsnap.deleteSponsorLogo', "`sponsorId` must be provided");
  }
  if (this.isItem(sponsorId, 'sponsor')) {
    sponsorId = sponsorId.id;
  }
  if (!this.isId(sponsorId)) {
    throw new TSArgsError('teamsnap.deleteSponsorLogo', "`sponsorId` must be a valid id");
  }
  params = {
    sponsorId: sponsorId
  };
  return this.collections.sponsors.exec('removeSponsorLogo', params).callback(callback);
};

});

require.register("collections/sports", function(exports, require, module) {
exports.loadSports = function(params, callback) {
  if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadSports', 'must provide query parameters');
  }
  return this.loadItems('sport', params, callback);
};

exports.loadSport = function(teamId, callback) {
  var params;
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.loadSport', 'must provide a teamId');
  }
  params = {
    teamId: teamId
  };
  return this.loadItem('sport', params, callback);
};

});

require.register("collections/teamFiles", function(exports, require, module) {
exports.loadTeamFiles = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamFiles', 'must provide a teamId or query parameters');
  }
  return this.loadItems('teamFile', params, callback);
};

});

require.register("collections/teamPreferences", function(exports, require, module) {
exports.loadTeamsPreferences = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamPreferences', 'must provide a teamId or query parameters');
  }
  return this.loadItems('teamPreferences', params, callback);
};

exports.loadTeamPreferences = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamPreferences', 'must provide a teamId or query parameters');
  }
  return this.loadItem('teamPreferences', params, callback);
};

exports.saveTeamPreferences = function(teamPreferences, callback) {
  if (!teamPreferences) {
    throw new TSArgsError('teamsnap.saveTeamPreferences', "`teamPreferences` must be provided");
  }
  if (!this.isItem(teamPreferences, 'teamPreferences')) {
    throw new TSArgsError('teamsnap.saveTeamPreferences', "`teamPreferences.type` must be 'teamPreferences'");
  }
  return this.saveItem(teamPreferences, callback);
};

exports.uploadTeamPhoto = function(teamPreferencesId, file, callback) {
  var params;
  if (this.isItem(teamPreferencesId, 'teamPreferences')) {
    teamPreferencesId = teamPreferences.id;
  }
  if (typeof FormData === 'undefined') {
    this.reject('Your browser does not support the new file upload APIs.', 'file', callback);
  }
  if (!this.isId(teamPreferencesId)) {
    throw new TSArgsError('teamsnap.uploadTeamPhoto', 'must include `teamPreferencesId`');
  }
  if (!(file instanceof File)) {
    throw new TSArgsError('teamsnap.uploadTeamPhoto', 'must include `file` as type File');
  }
  params = {
    teamPreferencesId: teamPreferencesId,
    file: file
  };
  return this.collections.teamsPreferences.exec('uploadTeamPhoto', params).pop().callback(callback);
};

exports.deleteTeamPhoto = function(teamPreferencesId, callback) {
  var params;
  if (!teamPreferencesId) {
    throw new TSArgsError('teamsnap.deleteTeamPhoto', "`teamPreferencesId` must be provided");
  }
  if (this.isItem(teamPreferencesId, 'teamPreferences')) {
    teamPreferencesId = teamPreferences.id;
  }
  if (!this.isId(teamPreferencesId)) {
    throw new TSArgsError('teamsnap.deleteTeamPhoto', "`teamPreferencesId` must be a valid id");
  }
  params = {
    teamPreferencesId: teamPreferencesId
  };
  return this.collections.teamsPreferences.exec('removeTeamPhoto', params).callback(callback);
};

exports.uploadTeamLogo = function(teamPreferencesId, file, callback) {
  var params;
  if (this.isItem(teamPreferencesId, 'teamPreferences')) {
    teamPreferencesId = teamPreferences.id;
  }
  if (typeof FormData === 'undefined') {
    this.reject('Your browser does not support the new file upload APIs.', 'file', callback);
  }
  if (!this.isId(teamPreferencesId)) {
    throw new TSArgsError('teamsnap.uploadTeamLogo', 'must include `teamPreferencesId`');
  }
  if (!(file instanceof File)) {
    throw new TSArgsError('teamsnap.uploadTeamLogo', 'must include `file` as type File');
  }
  params = {
    teamPreferencesId: teamPreferencesId,
    file: file
  };
  return this.collections.teamsPreferences.exec('uploadTeamLogo', params).pop().callback(callback);
};

exports.deleteTeamLogo = function(teamPreferencesId, callback) {
  var params;
  if (!teamPreferencesId) {
    throw new TSArgsError('teamsnap.deleteTeamLogo', "`teamPreferencesId` must be provided");
  }
  if (this.isItem(teamPreferencesId, 'teamPreferences')) {
    teamPreferencesId = teamPreferences.id;
  }
  if (!this.isId(teamPreferencesId)) {
    throw new TSArgsError('teamsnap.deleteTeamLogo', "`teamPreferencesId` must be a valid id");
  }
  params = {
    teamPreferencesId: teamPreferencesId
  };
  return this.collections.teamsPreferences.exec('removeTeamLogo', params).callback(callback);
};

});

require.register("collections/teamPublicSites", function(exports, require, module) {
exports.loadTeamPublicSites = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamPublicSites', 'must provide a teamId or query parameters');
  }
  return this.loadItems('teamPublicSite', params, callback);
};

exports.loadTeamPublicSite = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamPublicSite', 'must provide a teamId or query parameters');
  }
  return this.loadItem('teamPublicSite', params, callback);
};

exports.saveTeamPublicSite = function(teamPublicSite, callback) {
  if (!teamPublicSite) {
    throw new TSArgsError('teamsnap.saveTeamPublicSite', "`teamPublicSite` must be provided");
  }
  if (!this.isItem(teamPublicSite, 'teamPublicSite')) {
    throw new TSArgsError('teamsnap.saveTeamPublicSite', "`teamPublicSite.type` must be 'teamPublicSite'");
  }
  return this.saveItem(teamPublicSite, callback);
};

exports.uploadTeamPublicPhoto = function(teamPublicSiteId, file, callback) {
  var params;
  if (this.isItem(teamPublicSiteId, 'teamPublicSite')) {
    teamPublicSiteId = teamPublicSite.id;
  }
  if (typeof FormData === 'undefined') {
    this.reject('Your browser does not support the new file upload APIs.', 'file', callback);
  }
  if (!this.isId(teamPublicSiteId)) {
    throw new TSArgsError('teamsnap.uploadTeamPublicPhoto', 'must include `teamPublicSiteId`');
  }
  if (!(file instanceof File)) {
    throw new TSArgsError('teamsnap.uploadTeamPublicPhoto', 'must include `file` as type File');
  }
  params = {
    teamPublicSiteId: teamPublicSiteId,
    file: file
  };
  return this.collections.teamPublicSites.exec('uploadTeamPublicPhoto', params).pop().callback(callback);
};

exports.deleteTeamPublicPhoto = function(teamPublicSiteId, callback) {
  var params;
  if (!teamPublicSiteId) {
    throw new TSArgsError('teamsnap.deleteTeamPublicPhoto', "`teamPublicSiteId` must be provided");
  }
  if (this.isItem(teamPublicSiteId, 'teamPublicSite')) {
    teamPublicSiteId = teamPublicSite.id;
  }
  if (!this.isId(teamPublicSiteId)) {
    throw new TSArgsError('teamsnap.deleteTeamPublicPhoto', "`teamPublicSiteId` must be a valid id");
  }
  params = {
    teamPublicSiteId: teamPublicSiteId
  };
  return this.collections.teamPublicSites.exec('removeTeamPublicPhoto', params).callback(callback);
};

exports.validateSubdomain = function(subdomain, callback) {
  var params;
  if (!subdomain) {
    throw new TSArgsError('teamsnap.validateSubdomain', "`subdomain` must be provided");
  }
  params = {
    subdomain: subdomain
  };
  return this.collections.teamPublicSites.exec('validateSubdomain', params).callback(callback);
};

});

require.register("collections/teamResults", function(exports, require, module) {
exports.loadTeamsResults = function(params, callback) {
  if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamsResults', 'must provide query parameters');
  }
  return this.loadItems('teamResults', params, callback);
};

exports.loadTeamResults = function(teamId, callback) {
  var params;
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.loadTeamResults', 'must provide a teamId');
  }
  params = {
    teamId: teamId
  };
  return this.loadItem('teamResults', params, callback);
};

});

require.register("collections/teams", function(exports, require, module) {
var cleanArray;

exports.loadTeams = function(params, callback) {
  if (params == null) {
    params = {};
  }
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }
  if (Object.keys(params).length) {
    return this.loadItems('team', params, callback);
  } else {
    return this.loadMe().then((function(_this) {
      return function(me) {
        params.userId = me.id;
        return _this.loadItems('team', params, callback);
      };
    })(this));
  }
};

exports.loadTeam = function(teamId, callback) {
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.loadTeam', 'teamId must be provided');
  }
  return this.loadItem('team', {
    teamId: teamId
  }, callback);
};

exports.createTeam = function(data) {
  return this.createItem(data, {
    type: 'team',
    name: ''
  });
};

exports.saveTeam = function(team, callback) {
  var _ref;
  if (!team) {
    throw new TSArgsError('teamsnap.saveTeam', "`team` must be provided");
  }
  if (!this.isItem(team, 'team')) {
    throw new TSArgsError('teamsnap.saveTeam', "`type` must be 'team'");
  }
  if (!((_ref = team.name) != null ? _ref.trim() : void 0)) {
    return this.reject('You must provide a name for the team.', 'name', callback);
  }
  return this.saveItem(team, callback);
};

exports.deleteTeam = function(team, callback) {
  if (!team) {
    throw new TSArgsError('teamsnap.deleteTeam', '`team` must be provided');
  }
  return this.deleteItem(team, callback);
};

exports.bulkLoad = function(teamId, types, callback) {
  var params;
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.bulkLoad', 'teamId must be provided');
  }
  if (typeof types === 'function') {
    callback = types;
    types = null;
  }
  if (!Array.isArray(types)) {
    types = this.getTeamTypes();
    types.splice(types.indexOf('availability'), 1);
  }
  params = {
    teamId: teamId,
    types: types.map(this.underscoreType).join(',')
  };
  return this.collections.root.queryItems('bulkLoad', params, callback);
};

exports.invite = function(options) {
  if (options == null) {
    options = {};
  }
  cleanArray(options, 'memberId');
  cleanArray(options, 'contactId');
  if (!(options.memberId || options.contactId)) {
    throw new TSArgsError('teamsnap.invite', 'options.memberId or options.contactId is required.');
  }
  if (!options.teamId) {
    throw new TSArgsError('teamsnap.invite', 'options.teamId is required.');
  }
  if (!options.notifyAsMemberId) {
    throw new TSArgsError('teamsnap.invite', 'options.notifyAsMemberId is required.');
  }
  return this.collections.teams.exec('invite', options);
};

cleanArray = function(obj, prop) {
  var plural;
  plural = prop + 's';
  if (obj[plural]) {
    obj[prop] = obj[plural];
    delete obj[plural];
  }
  if ((obj[prop] != null) && !Array.isArray(obj[prop])) {
    obj[prop] = [obj[prop]];
  }
  return obj;
};

});

require.register("collections/trackedItemStatuses", function(exports, require, module) {
var key, statuses, value, _ref;

exports.TRACKING = {
  NONE: 0,
  CHECK: 1,
  X: 2
};

statuses = {};

_ref = exports.TRACKING;
for (key in _ref) {
  value = _ref[key];
  statuses[value] = true;
}

exports.loadTrackedItemStatuses = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTrackedItemStatuses', 'must provide a teamId or query parameters');
  }
  return this.loadItems('trackedItemStatus', params, callback);
};

exports.saveTrackedItemStatus = function(trackedItemStatus, callback) {
  if (!trackedItemStatus) {
    throw new TSArgsError('teamsnap.saveTrackedItemStatus', "`trackedItemStatus` must be provided");
  }
  if (!this.isItem(trackedItemStatus, 'trackedItemStatus')) {
    throw new TSArgsError('teamsnap.saveTrackedItemStatus', "`trackedItemStatus.type` must be 'trackedItemStatus'");
  }
  if (!statuses[trackedItemStatus.statusCode]) {
    return this.reject('You must select a valid status', 'statusCode', callback);
  }
  return this.saveItem(trackedItemStatus, callback);
};

});

require.register("collections/trackedItems", function(exports, require, module) {
exports.loadTrackedItems = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTrackedItems', 'must provide a teamId or query parameters');
  }
  return this.loadItems('trackedItem', params, callback);
};

exports.createTrackedItem = function(data) {
  return this.createItem(data, {
    type: 'trackedItem',
    name: ''
  });
};

exports.saveTrackedItem = function(trackedItem, callback) {
  var _ref;
  if (!trackedItem) {
    throw new TSArgsError('teamsnap.saveTrackedItem', "`trackedItem` must be provided");
  }
  if (!this.isItem(trackedItem, 'trackedItem')) {
    throw new TSArgsError('teamsnap.saveTrackedItem', "`trackedItem.type` must be 'trackedItem'");
  }
  if (!trackedItem.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!((_ref = trackedItem.name) != null ? _ref.trim() : void 0)) {
    return this.reject('You must provide a name for the tracked item.', 'name', callback);
  }
  return this.saveItem(trackedItem, callback);
};

exports.deleteTrackedItem = function(trackedItem, callback) {
  if (!trackedItem) {
    throw new TSArgsError('teamsnap.deleteTrackedItem', '`trackedItem` must be provided');
  }
  return this.deleteItem(trackedItem, callback);
};

});

require.register("collections/users", function(exports, require, module) {
exports.loadUsers = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadUsers', 'must provide a teamId or query parameters');
  }
  return this.loadItems('user', params, callback);
};

exports.loadMe = function(callback) {
  return this.collections.root.loadItem('me', callback);
};

exports.saveUser = function(user, callback) {
  var _ref;
  if (!user) {
    throw new TSArgsError('teamsnap.saveUser', "`user` must be provided");
  }
  if (!this.isItem(user, 'user')) {
    throw new TSArgsError('teamsnap.saveUser', "`user.type` must be 'user'");
  }
  if (!((_ref = user.email) != null ? _ref.trim() : void 0)) {
    return this.reject('You must provide an email for the user.', 'email', callback);
  }
  return this.saveItem(user, callback);
};

});

require.register("errors", function(exports, require, module) {
var TSArgsError, TSError, TSServerError, TSValidationError,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TSError = (function(_super) {
  __extends(TSError, _super);

  function TSError(message) {
    TSError.__super__.constructor.call(this);
    this.name = 'TeamSnapError';
    this.message = message;
  }

  return TSError;

})(Error);

TSArgsError = (function(_super) {
  __extends(TSArgsError, _super);

  function TSArgsError(method, msg) {
    TSArgsError.__super__.constructor.call(this);
    this.name = 'TeamSnapArgumentError';
    this.message = "Failed to execute `" + method + "`: " + msg + ".";
  }

  return TSArgsError;

})(TypeError);

TSValidationError = (function(_super) {
  __extends(TSValidationError, _super);

  function TSValidationError(message, field) {
    TSValidationError.__super__.constructor.call(this);
    this.name = 'TeamSnapValidationError';
    this.message = message;
    this.field = field;
  }

  return TSValidationError;

})(RangeError);

TSServerError = (function(_super) {
  __extends(TSServerError, _super);

  function TSServerError(message) {
    TSServerError.__super__.constructor.call(this);
    this.name = 'TeamSnapServerError';
    this.message = message || 'An unknown error occurred on TeamSnap\'s server.';
  }

  TSServerError.create = function(message, jqxhr) {
    return new TSServerError(message, jqxhr);
  };

  return TSServerError;

})(Error);

global.TSError = TSError;

global.TSArgsError = TSArgsError;

global.TSValidationError = TSValidationError;

global.TSServerError = TSServerError;

});

require.register("linking", function(exports, require, module) {
var linkItem, linkItemWith, linkItems, types, unlinkItem, unlinkItemFrom, unlinkItems, unlinkItemsFrom;

types = require('./types');

linkItems = function(items, lookup) {
  if (lookup == null) {
    lookup = {};
  }
  if (!items) {
    return;
  }
  if (Array.isArray(items)) {
    items.forEach(function(item) {
      if (item.href) {
        return lookup[item.href] = item;
      }
    });
    items.forEach(function(item) {
      return linkItem(item, lookup);
    });
  } else {
    if (items.href) {
      lookup[items.href] = items;
    }
    linkItem(items, lookup);
  }
  return items;
};

unlinkItems = function(items, lookup) {
  if (lookup == null) {
    lookup = {};
  }
  if (!items) {
    return;
  }
  if (Array.isArray(items)) {
    items.forEach(function(item) {
      return unlinkItem(item, lookup);
    });
  } else {
    unlinkItem(items, lookup);
  }
  return items;
};

linkItem = function(item, lookup) {
  if (!lookup) {
    throw new TSArgsError('linkItem', 'lookup must be provided');
  }
  if (item.href) {
    lookup[item.href] = item;
  }
  return item.links.each(function(rel, href) {
    var related;
    if (types.isPluralType(rel)) {
      if (!item[rel]) {
        return item[rel] = [];
      }
    } else {
      if (!(related = lookup[href])) {
        return;
      }
      item[rel] = related;
      return linkItemWith(item, related);
    }
  });
};

linkItemWith = function(item, other) {
  var plural;
  plural = types.getPluralType(item.type);
  if (plural && other.links.has(plural)) {
    if (!other[plural]) {
      other[plural] = [];
    }
    if (other[plural].indexOf(item) === -1) {
      return other[plural].push(item);
    }
  } else {
    return other.links.each(function(rel, href) {
      if (href === item.href) {
        return other[rel] = item;
      }
    });
  }
};

unlinkItem = function(item, lookup) {
  if (!item.href) {
    return;
  }
  if (lookup[item.href] === item) {
    delete lookup[item.href];
  }
  return item.links.each(function(rel, href) {
    if (!item[rel]) {
      return;
    }
    if (types.isPluralType(rel)) {
      unlinkItemsFrom(item[rel], item);
    } else {
      unlinkItemFrom(item, item[rel]);
    }
    return delete item[rel];
  });
};

unlinkItemFrom = function(item, other) {
  var index, plural;
  plural = types.getPluralType(item.type);
  if (plural && other.links.has(plural) && other[plural]) {
    index = other[plural].indexOf(item);
    if (index !== -1) {
      return other[plural].splice(index, 1);
    }
  } else {
    return other.links.each(function(rel, href) {
      if (other[rel] === item) {
        return delete other[rel];
      }
    });
  }
};

unlinkItemsFrom = function(items, from) {
  return items.forEach(function(item) {
    return item.links.each(function(rel, href) {
      if (item[rel] === from) {
        return delete item[rel];
      }
    });
  });
};

exports.linkItems = linkItems;

exports.unlinkItems = unlinkItems;

exports.linkItem = linkItem;

exports.linkItemWith = linkItemWith;

exports.unlinkItem = unlinkItem;

exports.unlinkItemFrom = unlinkItemFrom;

exports.unlinkItemsFrom = unlinkItemsFrom;

});

require.register("loadCollections", function(exports, require, module) {
var Collection, collectionsPromise, promises, types;

promises = require('./promises');

types = require('./types');

Collection = require('./model').Collection;

collectionsPromise = null;

module.exports = function(request, cachedCollections) {
  if (!collectionsPromise || collectionsPromise.getStatus() === 'reject') {
    collectionsPromise = request.get(teamsnap.apiUrl).then(function(xhr) {
      var collections, key, loads, root, value;
      collections = {};
      collections.root = root = Collection.fromData(xhr.data);
      if (cachedCollections && cachedCollections.root.version === root.version) {
        collections = {};
        for (key in cachedCollections) {
          value = cachedCollections[key];
          collections[key] = new Collection(value);
        }
        return collectionsPromise = promises.resolve(collections);
      } else {
        loads = [];
        types.getTypes().forEach(function(type) {
          var rel;
          rel = types.getPluralType(type);
          if (root.links.has(rel)) {
            return loads.push(request.get(root.links.href(rel)).then(function(xhr) {
              return collections[rel] = Collection.fromData(xhr.data);
            }));
          }
        });
        return promises.when.apply(promises, loads).then(function() {
          return collections;
        });
      }
    });
  }
  return collectionsPromise;
};

module.exports.clear = function() {
  return collectionsPromise = null;
};

});

require.register("model", function(exports, require, module) {
var Collection, File, Item, MetaList, ScopedCollection, camelize, copy, dateField, dateValue, promises, underscore,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

promises = require('./promises');

File = global.File || function() {};

Collection = (function() {
  Collection.fromData = function(data) {
    return new Collection().deserialize(data);
  };

  function Collection(data) {
    if (data == null) {
      data = {};
    }
    this.href = data.href;
    this.links = new MetaList(data.links);
    this.queries = new MetaList(data.queries);
    this.commands = new MetaList(data.commands);
    this.template = data.template || [];
    if (data.version) {
      this.version = data.version;
    }
    if (data.items) {
      this.items = data.items;
    }
  }

  Collection.prototype.deserialize = function(data) {
    var _ref, _ref1;
    if (data.collection) {
      data = data.collection;
    }
    if (!data) {
      return;
    }
    this.href = data.href;
    this.links.deserialize(data.links);
    this.queries.deserialize(data.queries);
    this.commands.deserialize(data.commands);
    if (data.version) {
      this.version = data.version;
    }
    this.template = ((_ref = data.template) != null ? _ref.data : void 0) || [];
    if ((_ref1 = data.items) != null ? _ref1.length : void 0) {
      this.items = data.items;
    }
    return this;
  };

  return Collection;

})();

ScopedCollection = (function(_super) {
  __extends(ScopedCollection, _super);

  ScopedCollection.fromData = function(request, data) {
    return new ScopedCollection(request, new Collection().deserialize(data));
  };

  function ScopedCollection(_request, collection) {
    this._request = _request;
    this.href = collection.href;
    this.links = collection.links;
    this.queries = collection.queries;
    this.commands = collection.commands;
    this.template = collection.template;
    this.version = collection.version;
    if (collection.items) {
      this.items = Item.fromArray(this._request, collection.items);
    }
  }

  ScopedCollection.prototype.save = function(item, callback) {
    var data, method;
    if (!(item instanceof Item)) {
      item = Item.create(this._request, item);
    }
    method = item.href ? 'put' : 'post';
    data = item.serialize(this.template);
    if (data.template.data.length === 0) {
      return promises.resolve(item).callback(callback);
    }
    return this._request(method, item.href || this.href, data).then((function(_this) {
      return function(xhr) {
        var all, items, _ref, _ref1;
        if ((items = (_ref = xhr.data) != null ? (_ref1 = _ref.collection) != null ? _ref1.items : void 0 : void 0)) {
          if (items.length > 1) {
            item.deserialize(items.shift());
            all = Item.fromArray(_this._request, items);
            all.unshift(item);
            return all;
          } else if (items.length) {
            return item.deserialize(xhr.data);
          }
        }
      };
    })(this)).callback(callback);
  };

  ScopedCollection.prototype.loadItems = function(linkName, callback) {
    return this.links.loadItems(this._request, linkName, callback);
  };

  ScopedCollection.prototype.loadItem = function(linkName, callback) {
    return this.links.loadItem(this._request, linkName, callback);
  };

  ScopedCollection.prototype.queryItems = function(queryName, params, callback) {
    return this.queries.loadItems(this._request, queryName, params, callback);
  };

  ScopedCollection.prototype.queryItem = function(queryName, params, callback) {
    return this.queries.loadItem(this._request, queryName, params, callback);
  };

  ScopedCollection.prototype.exec = function(commandName, params, callback) {
    return this.commands.exec(this._request, commandName, params, callback);
  };

  return ScopedCollection;

})(Collection);

Item = (function() {
  Item.create = function(request, data) {
    return new Item(request, data);
  };

  Item.fromArray = function(request, array) {
    if (Array.isArray(array)) {
      return array.map(function(data) {
        return Item.fromData(request, data);
      });
    } else {
      return array;
    }
  };

  Item.fromData = function(request, data) {
    if (data.collection || data.data) {
      return this.create(request).deserialize(data);
    } else {
      return this.create(request, data);
    }
  };

  function Item(_request, data) {
    this._request = _request;
    if (typeof data === 'string') {
      this.href = data;
    } else if (data && typeof data === 'object') {
      copy(data, this);
    }
    if (!(this.links instanceof MetaList)) {
      this.links = new MetaList(data != null ? data.links : void 0);
    }
  }

  Item.prototype.deserialize = function(data) {
    var prop, value, _i, _len, _ref, _ref1;
    if (data != null ? data.collection : void 0) {
      data = (_ref = data.collection.items) != null ? _ref[0] : void 0;
    }
    if (!data) {
      return;
    }
    this.href = data.href;
    this.links.deserialize(data.links);
    _ref1 = data.data;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      prop = _ref1[_i];
      value = prop.value;
      if (prop.type === 'DateTime' && value) {
        value = new Date(value);
      }
      if (prop.name === 'type') {
        value = camelize(value);
      }
      this[camelize(prop.name)] = value;
    }
    return this;
  };

  Item.prototype.serialize = function(template) {
    var fields, item;
    if (!(template != null ? template.length : void 0)) {
      throw new TSError('You must provide the collection\'s template');
    }
    fields = [];
    item = this;
    template.forEach(function(prop) {
      var value;
      value = item[camelize(prop.name)];
      if (prop.name === 'type') {
        value = underscore(value);
      }
      if (value !== void 0) {
        return fields.push({
          name: prop.name,
          value: value
        });
      }
    });
    return {
      template: {
        data: fields
      }
    };
  };

  Item.prototype.loadItems = function(linkName, callback) {
    return this.links.loadItems(this._request, linkName, callback);
  };

  Item.prototype.loadItem = function(linkName, callback) {
    return this.links.loadItem(this._request, linkName, callback);
  };

  Item.prototype["delete"] = function(params, callback) {
    var data, fields, key, value;
    if (typeof params === 'function') {
      callback = params;
      params = null;
    }
    if (params) {
      fields = [];
      for (key in params) {
        if (!__hasProp.call(params, key)) continue;
        value = params[key];
        fields.push({
          name: underscore(key),
          value: value
        });
      }
      data = {
        template: {
          data: fields
        }
      };
    }
    return this._request["delete"](this.href, data).callback(callback);
  };

  Item.prototype.copy = function(template) {
    var obj;
    obj = {};
    if (template) {
      template.forEach((function(_this) {
        return function(prop) {
          var camel;
          camel = camelize(prop.name);
          return obj[camel] = _this[camel];
        };
      })(this));
    } else {
      copy(this, obj);
    }
    delete obj.id;
    delete obj.href;
    obj.type = this.type;
    obj.links = this.links.cloneEmpty();
    return new Item(this._request, obj);
  };

  Item.prototype.toJSON = function() {
    var obj;
    obj = {};
    Object.keys(this).forEach((function(_this) {
      return function(key) {
        var value;
        value = _this[key];
        if (typeof value === 'function' || key.charAt(0) === '_' || _this.links.has(key)) {
          return;
        }
        return obj[key] = _this[key];
      };
    })(this));
    return obj;
  };

  return Item;

})();

MetaList = (function() {
  function MetaList(data) {
    if (data) {
      copy(data, this);
    }
  }

  MetaList.prototype.deserialize = function(data) {
    var entry, link, linksToRemove, param, params, propName, _i, _j, _len, _len1, _ref, _results;
    if (!Array.isArray(data)) {
      return;
    }
    linksToRemove = {};
    Object.keys(this).forEach(function(link) {
      return linksToRemove[link] = true;
    });
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      entry = data[_i];
      params = {};
      if (Array.isArray(entry.data)) {
        _ref = entry.data;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          param = _ref[_j];
          params[camelize(param.name)] = param.value;
        }
      }
      propName = camelize(entry.rel);
      this[propName] = {
        href: entry.href,
        params: params
      };
      delete linksToRemove[propName];
    }
    _results = [];
    for (link in linksToRemove) {
      _results.push(delete this[link]);
    }
    return _results;
  };

  MetaList.prototype.has = function(rel) {
    return this.hasOwnProperty(rel);
  };

  MetaList.prototype.href = function(rel) {
    var _ref;
    return (_ref = this[rel]) != null ? _ref.href : void 0;
  };

  MetaList.prototype.each = function(iterator) {
    var entry, rel, _results;
    _results = [];
    for (rel in this) {
      if (!__hasProp.call(this, rel)) continue;
      entry = this[rel];
      _results.push(iterator(rel, entry.href, entry.params));
    }
    return _results;
  };

  MetaList.prototype.loadItems = function(request, rel, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = void 0;
    }
    return this._request(request, 'get', rel, params, 'items').callback(callback);
  };

  MetaList.prototype.loadItem = function(request, rel, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = void 0;
    }
    return this._request(request, 'get', rel, params, 'item').callback(callback);
  };

  MetaList.prototype["delete"] = function(request, rel, callback) {
    return this._request(request, 'delete', rel, void 0, 'item').callback(callback);
  };

  MetaList.prototype.exec = function(request, rel, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = void 0;
    }
    return this._request(request, 'post', rel, params, 'items').callback(callback);
  };

  MetaList.prototype.cloneEmpty = function() {
    var clone, entry, rel;
    clone = new MetaList();
    for (rel in this) {
      if (!__hasProp.call(this, rel)) continue;
      entry = this[rel];
      if (entry.href) {
        clone[rel] = {
          href: ''
        };
      }
    }
    return clone;
  };

  MetaList.prototype._request = function(request, method, rel, params, type) {
    var data, entry, key, value;
    if (!(entry = this[rel])) {
      throw new TSError("Unable to find rel '" + rel + "'");
    }
    if (params) {
      data = {};
      for (key in params) {
        if (!__hasProp.call(params, key)) continue;
        value = params[key];
        if (value instanceof File) {
          data = new FormData();
          for (key in params) {
            if (!__hasProp.call(params, key)) continue;
            value = params[key];
            data.append(underscore(key), value);
          }
          break;
        }
        if (entry.params.hasOwnProperty(key)) {
          data[underscore(key)] = value;
        }
      }
    }
    return request(method, entry.href, data).then(function(xhr) {
      var items, _ref, _ref1;
      items = ((_ref = xhr.data) != null ? (_ref1 = _ref.collection) != null ? _ref1.items : void 0 : void 0) ? Item.fromArray(request, xhr.data.collection.items) : [];
      if (type === 'item') {
        return items.pop();
      } else {
        return items;
      }
    });
  };

  return MetaList;

})();

dateField = /(At|Date)$/;

dateValue = /^\d{4}-/;

copy = function(from, to) {
  Object.keys(from).forEach(function(key) {
    var value;
    value = from[key];
    if (typeof value === 'function' || key.charAt(0) === '_') {
      return;
    }
    if (dateField.test(key) && dateValue.test(value)) {
      value = new Date(value);
    }
    return to[key] = value;
  });
  return to;
};

camelize = function(str) {
  return str.replace(/[-_]+(\w)/g, function(_, char) {
    return char.toUpperCase();
  });
};

underscore = function(str) {
  return str.replace(/[A-Z]/g, function(char) {
    return '_' + char.toLowerCase();
  });
};

exports.Collection = Collection;

exports.ScopedCollection = ScopedCollection;

exports.Item = Item;

exports.MetaList = MetaList;

});

require.register("persistence", function(exports, require, module) {
var Item, MetaList, ScopedCollection, camelize, copy, linking, lookup, modifyModel, modifySDK, promises, revertModel, revertSDK, revertWrapMethod, types, wrapMethod, wrapSave, _ref,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

promises = require('./promises');

linking = require('./linking');

types = require('./types');

Item = require('./model').Item;

_ref = require('./model'), ScopedCollection = _ref.ScopedCollection, Item = _ref.Item, MetaList = _ref.MetaList;

lookup = null;

exports.enablePersistence = function(cachedItemData) {
  var initialItems;
  if (lookup) {
    return;
  }
  if (!this.collections) {
    throw new TSError('You must auth() and loadCollections() before enabling persistence.');
  }
  this.persistenceEnabled = true;
  lookup = {};
  modifyModel();
  modifySDK(this);
  initialItems = [];
  initialItems.push.apply(initialItems, this.plans);
  initialItems.push.apply(initialItems, this.smsGateways);
  initialItems.push.apply(initialItems, this.sports);
  initialItems.push.apply(initialItems, this.timeZones);
  linking.linkItems(this.plans.concat(this.sports), lookup);
  if (cachedItemData) {
    return Item.fromArray(this.request, cachedItemData);
  }
};

exports.disablePersistence = function() {
  if (!lookup) {
    return;
  }
  this.persistenceEnabled = false;
  linking.unlinkItems(Object.keys(lookup).map(function(href) {
    return lookup[href];
  }), lookup);
  lookup = null;
  revertModel();
  revertSDK(this);
  return this;
};

exports.findItem = function(href) {
  return lookup != null ? lookup[href] : void 0;
};

exports.getAllItems = function() {
  return Object.keys(lookup).map(function(href) {
    return lookup[href];
  });
};

exports.unlinkTeam = function(team) {
  var items, plural, teamType, users, value, _i, _len, _ref1, _ref2;
  items = [team];
  users = (_ref1 = team.members) != null ? _ref1.filter(function(member) {
    return member.user;
  }).map(function(member) {
    return member.user;
  }) : void 0;
  _ref2 = this.getTeamTypes();
  for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
    teamType = _ref2[_i];
    plural = this.getPluralType(teamType);
    if ((value = team[plural]) && value.length) {
      items.push.apply(items, value);
    } else if ((value = team[teamType])) {
      items.push(value);
    }
  }
  return unlinkItems(items);
};

modifyModel = function() {
  wrapMethod(Item, 'fromArray', function(fromArray) {
    return function(request, array) {
      var items;
      items = fromArray.call(this, request, array);
      return linking.linkItems(items, lookup).map(function(item) {
        return item.saveState();
      });
    };
  });
  wrapMethod(ScopedCollection.prototype, 'save', function(save) {
    return function(item, callback) {
      return save.call(this, item).then(function(item) {
        if (Array.isArray(item)) {
          return item.map(function(item) {
            linking.linkItem(item, lookup);
            return item.saveState();
          });
        } else {
          linking.linkItem(item, lookup);
          return item.saveState();
        }
      }).callback(callback);
    };
  });
  wrapMethod(Item.prototype, 'delete', function(deleteItem) {
    return function(params, callback) {
      var item;
      item = this;
      linking.unlinkItem(item, lookup);
      return deleteItem.call(this, params).fail(function(err) {
        linking.linkItem(item, lookup);
        return err;
      }).callback(callback);
    };
  });
  wrapMethod(Item, 'create', function(create) {
    return function(request, data) {
      var item;
      item = create.call(this, request, data);
      linking.linkItem(item, lookup);
      return item;
    };
  });
  wrapMethod(Item.prototype, 'deserialize', function(deserialize) {
    return function(data) {
      var item, _ref1;
      if (data != null ? data.collection : void 0) {
        data = (_ref1 = data.collection.items) != null ? _ref1[0] : void 0;
      }
      item = lookup[data.href] || this;
      return deserialize.call(item, data);
    };
  });
  wrapMethod(Item.prototype, 'serialize', function(serialize) {
    return function(template) {
      var body, state;
      body = serialize.call(this, template);
      if ((state = this._state)) {
        body.template.data = body.template.data.filter(function(field) {
          var isSame, oldValue, value;
          oldValue = state[camelize(field.name)];
          value = field.value;
          isSame = value === oldValue || (value && oldValue && value.valueOf() === oldValue.valueOf());
          return !isSame;
        });
      }
      return body;
    };
  });
  Item.prototype.saveState = function() {
    this._state = {
      _undos: []
    };
    if (this.href) {
      copy(this, this._state);
    }
    return this;
  };
  Item.prototype.rollback = function() {
    this._state._undos.reverse().forEach(function(undo) {
      return undo();
    });
    this._state._undos.length = 0;
    return copy(this._state, this);
  };
  return Item.prototype.link = function(rel, item) {
    var related, undos;
    if (!this._state) {
      this.saveState();
    }
    undos = this._state._undos;
    if (this[rel]) {
      related = this[rel];
      linking.unlinkItemFrom(this, this[rel]);
      undos.push((function(_this) {
        return function() {
          _this[rel] = related;
          _this.links[rel].href = related.href;
          _this[rel + 'Id'] = related.id;
          return linking.linkItemWith(_this, related);
        };
      })(this));
    }
    this[rel] = item;
    if (item) {
      this[rel + 'Id'] = item.id;
      this.links[rel].href = item.href;
      linking.linkItemWith(this, item);
      undos.push((function(_this) {
        return function() {
          delete _this[rel];
          delete _this[rel + 'Id'];
          return linking.unlinkItemFrom(_this, item);
        };
      })(this));
    }
    return this;
  };
};

revertModel = function() {
  revertWrapMethod(MetaList.prototype, '_request');
  revertWrapMethod(ScopedCollection.prototype, 'save');
  revertWrapMethod(Item.prototype, 'delete');
  revertWrapMethod(Item, 'create');
  revertWrapMethod(Item.prototype, 'deserialize');
  revertWrapMethod(Item.prototype, 'serialize');
  delete Item.prototype.saveState;
  delete Item.prototype.rollback;
  return delete Item.prototype.link;
};

modifySDK = function(sdk) {
  wrapSave(sdk, 'saveMember', function(member) {
    return promises.when(sdk.loadAvailabilities({
      memberId: member.id
    }), sdk.loadTrackedItemStatuses({
      memberId: member.id
    }), sdk.loadCustomData({
      memberId: member.id
    }));
  });
  wrapMethod(sdk, 'deleteMember', function(deleteMember) {
    return function(member, callback) {
      var toRemove;
      toRemove = [];
      toRemove.push.apply(toRemove, member.assignments);
      toRemove.push.apply(toRemove, member.availabilities);
      member.contacts.forEach(function(contact) {
        toRemove.push.apply(toRemove, contact.contactEmailAddresses);
        toRemove.push.apply(toRemove, contact.contactPhoneNumbers);
        return toRemove.push(contact);
      });
      toRemove.push.apply(toRemove, member.trackedItemStatuses);
      linking.unlinkItems(toRemove, lookup);
      return deleteMember.call(this, member, callback).fail(function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'deleteContact', function(deleteContact) {
    return function(contact, callback) {
      var toRemove;
      toRemove = [];
      toRemove.push.apply(toRemove, contact.contactEmailAddresses);
      toRemove.push.apply(toRemove, contact.contactPhoneNumbers);
      linking.unlinkItems(toRemove, lookup);
      return deleteContact.call(this, contact, callback).fail(function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
      }).callback(callback);
    };
  });
  wrapSave(sdk, 'saveEvent', function(event) {
    var ids;
    ids = Array.isArray(event) ? (event.map(function(event) {
      return event.id;
    })).join(',') : event.id;
    return sdk.loadAvailabilities({
      eventId: ids
    });
  }, function(event) {
    var e, firstEvent, repeatingEventIds, toRemove, _ref1, _ref2;
    if (event.isGame) {
      return promises.when(sdk.loadTeamResults(event.teamId), sdk.loadOpponentResults(event.opponentId));
    } else if (Array.isArray(event)) {
      repeatingEventIds = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = event.length; _i < _len; _i++) {
          e = event[_i];
          _results.push(e.id);
        }
        return _results;
      })();
      firstEvent = event.shift();
      toRemove = [];
      if ((_ref1 = firstEvent.team) != null) {
        if ((_ref2 = _ref1.events) != null) {
          _ref2.forEach(function(e) {
            if (e.repeatingUuid === firstEvent.repeatingUuid) {
              return toRemove.push(e);
            }
          });
        }
      }
      toRemove = toRemove.filter(function(e) {
        var _ref3;
        return _ref3 = e.id, __indexOf.call(repeatingEventIds, _ref3) < 0;
      });
      return linking.unlinkItems(toRemove, lookup);
    }
  });
  wrapMethod(sdk, 'deleteEvent', function(deleteEvent) {
    return function(event, include, callback) {
      var events, startDate, toRemove, uuid, _ref1, _ref2;
      events = [];
      if (typeof include === 'string' && include !== sdk.EVENTS.NONE) {
        uuid = event.repeatingUuid;
        startDate = event.startDate;
        if ((_ref1 = event.team) != null) {
          if ((_ref2 = _ref1.events) != null) {
            _ref2.forEach(function(event) {
              if (event.repeatingUuid === uuid) {
                return events.push(event);
              }
            });
          }
        }
        if (include === sdk.EVENTS.FUTURE) {
          events = events.filter(function(event) {
            return event.startDate >= startDate;
          });
        }
      } else {
        events.push(event);
      }
      toRemove = events.slice();
      events.forEach(function(event) {
        toRemove.push.apply(toRemove, event.assignments);
        return toRemove.push.apply(toRemove, event.availabilities);
      });
      linking.unlinkItems(toRemove, lookup);
      return deleteEvent.call(this, event, include, callback).then(function(result) {
        if (event.isGame) {
          return promises.when(sdk.loadTeamResults(event.teamId), sdk.loadOpponentResults(event.opponentId)).then(function() {
            return result;
          });
        } else {
          return result;
        }
      }, function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
      }).callback(callback);
    };
  });
  wrapSave(sdk, 'saveTrackedItem', function(trackedItem) {
    return sdk.loadTrackedItemStatuses({
      trackedItemId: trackedItem.id
    });
  });
  wrapMethod(sdk, 'deleteTrackedItem', function(deleteTrackedItem) {
    return function(trackedItem, callback) {
      var toRemove;
      toRemove = trackedItem.trackedItemStatuses.slice();
      linking.unlinkItems(toRemove, lookup);
      return deleteTrackedItem.call(this, trackedItem).fail(function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
      }).callback(callback);
    };
  });
  return wrapMethod(sdk, 'deleteTeam', function(deleteTeam) {
    return function(team, callback) {
      var toRemove;
      toRemove = [];
      team.links.each(function(rel) {
        var value;
        value = team[name];
        if (types.getType(rel) && rel !== 'sport' && rel !== 'plan') {
          if (Array.isArray(value)) {
            return toRemove.push.apply(toRemove, value);
          } else {
            return toRemove.push(value);
          }
        }
      });
      return deleteTeam.call(this, team).then(function(result) {
        linking.unlinkItems(toRemove, lookup);
        return result;
      }).callback(callback);
    };
  });
};

revertSDK = function(sdk) {
  revertWrapMethod(sdk, 'saveMember');
  revertWrapMethod(sdk, 'deleteMember');
  revertWrapMethod(sdk, 'deleteContact');
  revertWrapMethod(sdk, 'saveEvent');
  revertWrapMethod(sdk, 'deleteEvent');
  revertWrapMethod(sdk, 'saveTrackedItem');
  revertWrapMethod(sdk, 'deleteTrackedItem');
  return revertWrapMethod(sdk, 'deleteTeam');
};

wrapMethod = function(obj, methodName, newMethodProvider) {
  var oldMethod;
  oldMethod = obj[methodName];
  obj[methodName] = newMethodProvider(oldMethod);
  obj[methodName].oldMethod = oldMethod;
  return obj;
};

revertWrapMethod = function(obj, methodName) {
  var oldMethod;
  oldMethod = obj[methodName].oldMethod;
  return obj[methodName] = oldMethod;
};

wrapSave = function(sdk, saveMethodName, onSaveNew, onSaveEdit) {
  return wrapMethod(sdk, saveMethodName, function(save) {
    return function(item, callback) {
      var savedItem;
      if (item.id && onSaveEdit) {
        savedItem = null;
        return save.call(this, item).then(function(item) {
          return savedItem = item;
        }).then(onSaveEdit).then(function() {
          return savedItem;
        }).callback(callback);
      } else if (!item.id && onSaveNew) {
        savedItem = null;
        return save.call(this, item).then(function(item) {
          return savedItem = item;
        }).then(onSaveNew).then(function() {
          return savedItem;
        }).callback(callback);
      } else {
        return save.call(this, item, callback);
      }
    };
  });
};

copy = function(from, to) {
  Object.keys(from).forEach(function(key) {
    if (typeof value === 'function' || key.charAt(0) === '_') {
      return;
    }
    return to[key] = from[key];
  });
  return to;
};

camelize = function(str) {
  return str.replace(/[-_]+(\w)/g, function(_, char) {
    return char.toUpperCase();
  });
};

});

require.register("promises", function(exports, require, module) {
var Deferred, Promise, args, promises,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

promises = typeof exports !== 'undefined' ? exports : this;

Promise = (function() {
  function Promise() {
    this.call = __bind(this.call, this);
  }

  Promise.prototype.then = function(resolvedHandler, rejectedHandler, progressHandler, cancelHandler) {
    throw new TypeError('The Promise base class is abstract, this function is overwritten by the promise\'s deferred object');
  };

  Promise.prototype.callback = function(callback) {
    if (callback && typeof callback === 'function') {
      this.then(function() {
        var results;
        results = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return callback.apply(null, [null].concat(__slice.call(results)));
      }, function(err) {
        return callback(err);
      });
    }
    return this;
  };

  Promise.prototype.resolved = function(handler) {
    return this.then(handler);
  };

  Promise.prototype.done = function(handler) {
    return this.then(handler);
  };

  Promise.prototype.rejected = function(handler) {
    return this.then(null, handler);
  };

  Promise.prototype.fail = function(handler) {
    return this.then(null, handler);
  };

  Promise.prototype.always = function(handler) {
    var rejectedHandler, resolvedHandler;
    resolvedHandler = function(res) {
      return handler(null, res);
    };
    rejectedHandler = function(err) {
      return handler(err);
    };
    return this.then(resolvedHandler, rejectedHandler);
  };

  Promise.prototype.progress = function(handler) {
    return this.then(null, null, handler);
  };

  Promise.prototype.canceled = function(handler) {
    return this.then(null, null, null, handler);
  };

  Promise.prototype.apply = function(handler, context) {
    return this.then(function(result) {
      if ((result instanceof Array)(handler.apply(context || this, result))) {

      } else {
        return handler.call(context || this, result);
      }
    });
  };

  Promise.prototype.cancel = function() {
    throw new TypeError('The Promise base class is abstract, this function is overwritten by the promise\'s deferred object');
  };

  Promise.prototype.get = function(propertyName) {
    return this.then(function(object) {
      return object != null ? object[propertyName] : void 0;
    });
  };

  Promise.prototype.set = function(propertyName, value) {
    return this.then(function(object) {
      if (object != null) {
        object[propertyName] = value;
      }
      return object;
    });
  };

  Promise.prototype.put = function(propertyName, value) {
    return this.then(function(object) {
      return object != null ? object[propertyName] = value : void 0;
    });
  };

  Promise.prototype.run = function() {
    var functionName, params;
    functionName = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.then(function(object) {
      if (object != null) {
        object[functionName].apply(object, params);
      }
      return object;
    });
  };

  Promise.prototype.call = function() {
    var functionName, params;
    functionName = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.then(function(object) {
      return object[functionName].apply(object, params);
    });
  };

  return Promise;

})();

['pop', 'shift', 'splice', 'filter', 'every', 'map', 'some'].forEach(function(method) {
  return Promise.prototype[method] = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.then(function(object) {
      return object != null ? typeof object[method] === "function" ? object[method].apply(object, args) : void 0 : void 0;
    });
  };
});

['push', 'reverse', 'sort', 'unshift', 'forEach'].forEach(function(method) {
  return Promise.prototype[method] = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.then(function(object) {
      if (object instanceof Array) {
        object[method].apply(object, args);
      }
      return object;
    });
  };
});

Promise.extend = function(methods) {
  var SubPromise, name, value;
  SubPromise = function() {};
  SubPromise.extend = this.extend;
  SubPromise.prototype = new this();
  if (methods) {
    for (name in methods) {
      if (!__hasProp.call(methods, name)) continue;
      value = methods[name];
      SubPromise.prototype[name] = value;
    }
  }
  return SubPromise;
};

promises.when = function() {
  var alwaysCallback, count, createCallback, deferred, name, obj, params, rejected, rejectedCallback, resolvedCallback, _i, _len;
  params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  deferred = promises.defer();
  count = params.length;
  rejected = false;
  resolvedCallback = function() {};
  rejectedCallback = function(value) {
    rejected = true;
    return value;
  };
  createCallback = function(index) {
    return function() {
      var results;
      results = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      params[index] = results.length > 1 ? results : results[0];
      if (--count === 0) {
        if (rejected) {
          return deferred.reject.apply(deferred, params);
        } else {
          return deferred.resolve.apply(deferred, params);
        }
      }
    };
  };
  for (name = _i = 0, _len = params.length; _i < _len; name = ++_i) {
    obj = params[name];
    if (obj && typeof obj.then === 'function') {
      alwaysCallback = createCallback(name);
      obj.then(resolvedCallback, rejectedCallback);
      obj.then(alwaysCallback, alwaysCallback);
    } else {
      --count;
    }
  }
  if (count === 0) {
    deferred.resolve.apply(deferred, params);
  }
  return deferred.promise;
};

args = function() {
  var params;
  params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  params.isArgs = true;
  return params;
};

Deferred = (function() {
  function Deferred(promise) {
    if (promise == null) {
      promise = new promises.Promise;
    }
    this.progress = __bind(this.progress, this);
    this.cancel = __bind(this.cancel, this);
    this.reject = __bind(this.reject, this);
    this.resolve = __bind(this.resolve, this);
    this.finished = __bind(this.finished, this);
    this.then = __bind(this.then, this);
    this.promise = promise;
    this.status = 'pending';
    this.progressHandlers = [];
    this.handlers = [];
    promise.then = this.then;
    promise.cancel = this.cancel;
    promise.getStatus = (function(_this) {
      return function() {
        return _this.status;
      };
    })(this);
  }

  Deferred.prototype.then = function(resolvedHandler, rejectedHandler, progressHandler, canceledHandler) {
    var deferred, handler, method, nextDeferred, nextResult, _i, _len;
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      handler = arguments[_i];
      if ((handler != null) && typeof handler !== 'function') {
        throw new Error('Promise handlers must be functions');
      }
    }
    if (progressHandler) {
      this.progressHandlers.push(progressHandler);
    }
    nextDeferred = promises.defer();
    nextDeferred.promise.prev = this.promise;
    this._addHandler(resolvedHandler, rejectedHandler, canceledHandler).nextDeferred = nextDeferred;
    if (this.finished()) {
      handler = this.handlers.pop();
      method = handler[this.status];
      deferred = handler.nextDeferred;
      if (!method) {
        deferred[this.status].apply(deferred, this.results);
      } else {
        nextResult = method.apply(null, this.results);
        if (nextResult && typeof nextResult.then === 'function') {
          nextResult.then(deferred.resolve, deferred.reject);
        } else {
          deferred[this.status](nextResult);
        }
      }
    }
    return nextDeferred.promise;
  };

  Deferred.prototype.finished = function() {
    return this.status !== 'pending';
  };

  Deferred.prototype.resolve = function() {
    var deferred, handler, method, nextResult, results, _ref;
    results = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (this.status !== 'pending') {
      return;
    }
    if ((_ref = results[0]) != null ? _ref.isArgs : void 0) {
      results = results[0];
    }
    clearTimeout(this._timeout);
    this.status = 'resolve';
    this.results = results;
    while ((handler = this.handlers.shift())) {
      method = handler[this.status];
      deferred = handler.nextDeferred;
      if (!method) {
        deferred[this.status].apply(deferred, this.results);
      } else {
        nextResult = method.apply(null, this.results);
        if (nextResult && typeof nextResult.then === 'function') {
          nextResult.then(deferred.resolve, deferred.reject);
        } else {
          deferred[this.status](nextResult);
        }
      }
    }
  };

  Deferred.prototype.reject = function() {
    var deferred, handler, method, nextResult, results, _ref;
    results = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (this.status !== 'pending') {
      return;
    }
    if ((_ref = results[0]) != null ? _ref.isArgs : void 0) {
      results = results[0];
    }
    clearTimeout(this._timeout);
    this.status = 'reject';
    this.results = results;
    while ((handler = this.handlers.shift())) {
      method = handler[this.status];
      deferred = handler.nextDeferred;
      if (!method) {
        deferred[this.status].apply(deferred, this.results);
      } else {
        nextResult = method.apply(null, this.results);
        if (nextResult && typeof nextResult.then === 'function') {
          nextResult.then(deferred.resolve, deferred.reject);
        } else {
          deferred[this.status](nextResult);
        }
      }
    }
  };

  Deferred.prototype.cancel = function() {
    var deferred, handler, method, nextResult, results, _ref, _ref1;
    results = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (this.status !== 'pending') {
      return;
    }
    if ((_ref = results[0]) != null ? _ref.isArgs : void 0) {
      results = results[0];
    }
    clearTimeout(this._timeout);
    this.status = 'cancel';
    this.results = results;
    while ((handler = this.handlers.shift())) {
      method = handler[this.status];
      deferred = handler.nextDeferred;
      if (!method) {
        deferred[this.status].apply(deferred, this.results);
      } else {
        nextResult = method.apply(null, this.results);
        if (nextResult && typeof nextResult.then === 'function') {
          nextResult.then(deferred.resolve, deferred.reject);
        } else {
          deferred[this.status](nextResult);
        }
      }
    }
    if ((_ref1 = this.promise.prev) != null) {
      _ref1.cancel();
    }
  };

  Deferred.prototype.progress = function() {
    var params, progress, _i, _len, _ref, _results;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _ref = this.progressHandlers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      progress = _ref[_i];
      _results.push(progress.apply(null, params));
    }
    return _results;
  };

  Deferred.prototype.timeout = function(milliseconds, error) {
    clearTimeout(this._timeout);
    return this._timeout = setTimeout((function(_this) {
      return function() {
        return _this.reject(error != null ? error : new Error('Operation timed out'));
      };
    })(this), milliseconds);
  };

  Deferred.prototype.reset = function() {
    this.status = 'pending';
    this.progressHandlers = [];
    return this.handlers = [];
  };

  Deferred.prototype._addHandler = function(resolvedHandler, rejectedHandler, canceledHandler) {
    var handler;
    handler = {
      resolve: resolvedHandler,
      reject: rejectedHandler,
      cancel: canceledHandler
    };
    this.handlers.push(handler);
    return handler;
  };

  return Deferred;

})();

promises.Deferred = Deferred;

promises.Promise = Promise;

promises.args = args;

promises.defer = function(promise) {
  return new promises.Deferred(promise);
};

promises.wrap = function(method, PromiseClass) {
  return function() {
    var args, callback, deferred, promise;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    promise = PromiseClass ? new PromiseClass() : void 0;
    deferred = promises.defer(promise);
    if (typeof args[args.length - 1] === 'function') {
      callback = args.pop();
    }
    args.push(function(err, result) {
      var extras;
      extras = Array.prototype.slice.call(arguments, 2);
      if (callback) {
        callback.apply(null, [err, result].concat(__slice.call(extras)));
      }
      if (err) {
        return deferred.reject(err);
      } else {
        return deferred.resolve.apply(deferred, [result].concat(__slice.call(extras)));
      }
    });
    method.apply(this, args);
    return deferred.promise;
  };
};

promises.resolve = function() {
  var args, deferred;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  deferred = promises.defer();
  deferred.resolve.apply(deferred, args);
  return deferred.promise;
};

promises.reject = function() {
  var args, deferred;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  deferred = promises.defer();
  deferred.reject.apply(deferred, args);
  return deferred.promise;
};

});

require.register("request", function(exports, require, module) {
var FormData, RequestError, createRequest, promises, sendRequest, unloading,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof XMLHttpRequest === 'undefined') {
  global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

FormData = global.FormData || function() {};

promises = require('./promises');

sendRequest = function(method, url, data, hooks, callback) {
  var deferred, hook, key, query, value, xhr, _i, _len;
  if (data && method.toUpperCase() === 'GET') {
    query = [];
    for (key in data) {
      value = data[key];
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
    if (query.length) {
      url += url.indexOf('?') === -1 ? '?' : '&';
      url += query.join('&');
    }
  } else if (typeof data === 'object' && !(data instanceof FormData)) {
    data = JSON.stringify(data);
  }
  xhr = new XMLHttpRequest();
  xhr.open(method.toUpperCase(), url);
  if (hooks) {
    for (_i = 0, _len = hooks.length; _i < _len; _i++) {
      hook = hooks[_i];
      hook(xhr, data);
    }
  }
  deferred = promises.defer();
  xhr.onreadystatechange = function() {
    var errorMsg, _ref, _ref1, _ref2;
    switch (xhr.readyState) {
      case 3:
        return deferred.progress(xhr);
      case 4:
        try {
          xhr.data = JSON.parse(xhr.responseText);
        } catch (_error) {
          xhr.data = null;
        }
        if (xhr.status >= 400) {
          errorMsg = ((_ref = xhr.data) != null ? (_ref1 = _ref.collection) != null ? (_ref2 = _ref1.error) != null ? _ref2.message : void 0 : void 0 : void 0) || '';
        }
        if (xhr.status === 0) {
          if (unloading) {
            return promises.defer().promise;
          }
          return deferred.reject(new RequestError(RequestError.CONNECTION_ERROR, 'Could not connect to the server'), xhr, errorMsg);
        } else if (xhr.status >= 500) {
          if (global.console) {
            console.error("TeamSnap API error: " + errorMsg);
          }
          return deferred.reject(new RequestError(RequestError.SERVER_ERROR, 'Error with the server'), xhr, errorMsg);
        } else if (xhr.status > 400) {
          return deferred.reject(new RequestError(RequestError.CLIENT_ERROR, 'There was an error with the request'), xhr, errorMsg);
        } else if (xhr.status === 400) {
          return deferred.reject(new RequestError(RequestError.VALIDATION_ERROR, errorMsg || 'The data was invalid'), xhr);
        } else {
          return deferred.resolve(xhr);
        }
    }
  };
  xhr.send(data || null);
  return deferred.promise.callback(callback);
};

createRequest = function(hooks) {
  var request;
  if (hooks == null) {
    hooks = [];
  }
  request = function(method, url, data, callback) {
    if (typeof data === 'function') {
      callback = data;
      data = null;
    }
    return sendRequest(method, url, data, hooks, callback);
  };
  request.get = function(url, params, callback) {
    return request('get', url, params, callback);
  };
  request.post = function(url, params, callback) {
    return request('post', url, params, callback);
  };
  request.put = function(url, params, callback) {
    return request('put', url, params, callback);
  };
  request["delete"] = function(url, params, callback) {
    return request('delete', url, params, callback);
  };
  request.create = function() {
    return createRequest();
  };
  request.clone = function() {
    return createRequest(hooks.slice());
  };
  request.reset = function() {
    hooks = [];
    return this;
  };
  request.hook = function(hook) {
    hooks.push(hook);
    return this;
  };
  request.removeHook = function(hook) {
    var index;
    index = hooks.indexOf(hook);
    if (index !== -1) {
      hooks.splice(index, 1);
    }
    return this;
  };
  return request;
};

module.exports = createRequest();

RequestError = (function(_super) {
  __extends(RequestError, _super);

  RequestError.CONNECTION_ERROR = 1;

  RequestError.SERVER_ERROR = 2;

  RequestError.CLIENT_ERROR = 3;

  RequestError.VALIDATION_ERROR = 4;

  function RequestError(code, message) {
    this.code = code;
    this.message = message;
    RequestError.__super__.constructor.call(this);
    this.name = 'RequestError';
  }

  return RequestError;

})(Error);

if (typeof window !== 'undefined') {
  unloading = false;
  window.addEventListener('beforeunload', function() {
    unloading = true;
  });
}

});

;require.register("sdk", function(exports, require, module) {
var Item, ScopedCollection, TeamSnap, add, linking, loadCollections, mergeDefaults, promises, urlExp, _ref,
  __hasProp = {}.hasOwnProperty;

TeamSnap = require('./teamsnap').TeamSnap;

promises = require('./promises');

loadCollections = require('./loadCollections');

_ref = require('./model'), Item = _ref.Item, ScopedCollection = _ref.ScopedCollection;

urlExp = /^https?:\/\//;

TeamSnap.prototype.loadCollections = function(cachedCollections, callback) {
  if (typeof cachedCollections === 'function') {
    callback = cachedCollections;
    cachedCollections = null;
  }
  return loadCollections(this.request, cachedCollections).then((function(_this) {
    return function(colls) {
      _this.collections = {};
      Object.keys(colls).forEach(function(name) {
        return _this.collections[name] = new ScopedCollection(_this.request, colls[name]);
      });
      _this.apiVersion = colls.root.version;
      _this.plans = Item.fromArray(_this.request, colls.plans.items.slice());
      _this.smsGateways = Item.fromArray(_this.request, colls.smsGateways.items.slice());
      _this.sports = Item.fromArray(_this.request, colls.sports.items.slice());
      _this.timeZones = Item.fromArray(_this.request, colls.timeZones.items.slice());
      return _this;
    };
  })(this)).callback(callback);
};

TeamSnap.prototype.reloadCollections = function(callback) {
  loadCollections.clear();
  return this.loadCollections(callback);
};

TeamSnap.prototype.loadItems = function(type, params, callback) {
  var collection;
  if (!this.hasType(type)) {
    throw new TSArgsError('teamsnap.load*', 'must provide a valid `type`');
  }
  collection = this.getCollectionForItem(type);
  return collection.queryItems('search', params, callback);
};

TeamSnap.prototype.loadItem = function(type, params, callback) {
  var collection;
  if (!this.hasType(type)) {
    throw new TSArgsError('teamsnap.load*', 'must provide a valid `type`');
  }
  collection = this.getCollectionForItem(type);
  return collection.queryItem('search', params, callback);
};

TeamSnap.prototype.createItem = function(properties, defaults) {
  var collection;
  if (!properties) {
    properties = defaults;
    defaults = null;
  }
  if (defaults) {
    properties = mergeDefaults(properties, defaults);
  }
  if (!this.isItem(properties)) {
    throw new TSArgsError('teamsnap.create*', 'must include a valid `type`');
  }
  if (!properties.links) {
    collection = this.getCollectionForItem(properties.type);
    properties.links = collection.links.cloneEmpty();
  }
  return Item.create(this.request, properties);
};

TeamSnap.prototype.saveItem = function(item, callback) {
  var collection;
  if (!this.isItem(item)) {
    throw new TSArgsError('teamsnap.save*', 'must include a valid `type`');
  }
  collection = this.getCollectionForItem(item);
  return collection.save(item, callback);
};

TeamSnap.prototype.deleteItem = function(item, params, callback) {
  if (typeof item === 'string' && urlExp.test(item)) {
    item = {
      href: item
    };
  }
  if (!(typeof (item != null ? item.href : void 0) === 'string' && urlExp.test(item.href))) {
    throw new TSArgsError('teamsnap.delete*', 'item must have a valid href to delete');
  }
  if (!(item instanceof Item)) {
    item = Item.create(this.request, item);
  }
  return item["delete"](params, callback);
};

TeamSnap.prototype.copyItem = function(item) {
  var collection;
  collection = this.getCollectionForItem(item);
  return item.copy(collection.template);
};

TeamSnap.prototype.getNameSort = function() {
  return function(itemA, itemB) {
    var valueA, valueB;
    if (itemA.type !== itemB.type) {
      valueA = itemA.type;
      valueB = itemB.type;
    } else if (typeof itemA.name === 'string' && typeof itemB.name === 'string') {
      valueA = itemA.name.toLowerCase();
      valueB = itemB.name.toLowerCase();
    } else {
      if (itemA.createdAt && itemB.createdAt) {
        valueA = itemA.createdAt;
        valueB = itemB.createdAt;
      } else {
        valueA = itemA.id;
        valueB = itemB.id;
      }
    }
    if (valueA === valueB) {
      return 0;
    } else if (!valueA && valueB) {
      return 1;
    } else if (valueA && !valueB) {
      return -1;
    } else if (valueA > valueB) {
      return 1;
    } else if (valueA < valueB) {
      return -1;
    } else {
      return 0;
    }
  };
};

TeamSnap.prototype.getDefaultSort = function() {
  return function(itemA, itemB) {
    var valueA, valueB;
    if (itemA.type !== itemB.type) {
      valueA = itemA.type;
      valueB = itemB.type;
    } else {
      if (itemA.createdAt && itemB.createdAt) {
        valueA = itemA.createdAt;
        valueB = itemB.createdAt;
      } else {
        valueA = itemA.id;
        valueB = itemB.id;
      }
    }
    if (valueA === valueB) {
      return 0;
    } else if (!valueA && valueB) {
      return 1;
    } else if (valueA && !valueB) {
      return -1;
    } else if (valueA > valueB) {
      return 1;
    } else if (valueA < valueB) {
      return -1;
    } else {
      return 0;
    }
  };
};

TeamSnap.prototype.getCollectionForItem = function(item) {
  var collectionName, type;
  if (!this.collections) {
    throw new TSError('You must auth() and loadCollections() before using any load*, save*, create*, or delete* methods.');
  }
  type = typeof item === 'string' ? item : item.type;
  collectionName = this.getPluralType(type);
  return this.collections[collectionName];
};

TeamSnap.prototype.isId = function(value) {
  return typeof value === 'string' || typeof value === 'number';
};

TeamSnap.prototype.isItem = function(value, type) {
  return this.hasType(value != null ? value.type : void 0) && (!type || value.type === type);
};

TeamSnap.prototype.reject = function(msg, field, callback) {
  return promises.reject(new TSValidationError(msg, field)).callback(callback);
};

add = function(module) {
  var key, value, _results;
  _results = [];
  for (key in module) {
    value = module[key];
    _results.push(TeamSnap.prototype[key] = value);
  }
  return _results;
};

add(require('./types'));

linking = require('./linking');

TeamSnap.prototype.linkItems = linking.linkItems;

TeamSnap.prototype.unlinkItems = linking.unlinkItems;

add(require('./persistence'));

add(require('./collections/teams'));

add(require('./collections/assignments'));

add(require('./collections/availabilities'));

add(require('./collections/contactEmailAddresses'));

add(require('./collections/contactPhoneNumbers'));

add(require('./collections/contacts'));

add(require('./collections/customData'));

add(require('./collections/customFields'));

add(require('./collections/events'));

add(require('./collections/locations'));

add(require('./collections/memberEmailAddresses'));

add(require('./collections/memberFiles'));

add(require('./collections/memberLinks'));

add(require('./collections/memberPhoneNumbers'));

add(require('./collections/memberPreferences'));

add(require('./collections/members'));

add(require('./collections/opponents'));

add(require('./collections/opponentResults'));

add(require('./collections/plans'));

add(require('./collections/sponsors'));

add(require('./collections/sports'));

add(require('./collections/teamFiles'));

add(require('./collections/teamPreferences'));

add(require('./collections/teamPublicSites'));

add(require('./collections/teamResults'));

add(require('./collections/trackedItems'));

add(require('./collections/trackedItemStatuses'));

add(require('./collections/users'));

mergeDefaults = function(properties, defaults) {
  var key, obj, value;
  obj = {};
  for (key in properties) {
    if (!__hasProp.call(properties, key)) continue;
    value = properties[key];
    if (!(typeof value === 'function' || key.charAt(0) === '_')) {
      obj[key] = value;
    }
  }
  for (key in defaults) {
    if (!__hasProp.call(defaults, key)) continue;
    value = defaults[key];
    if (!(typeof value === 'function' || properties.hasOwnProperty(key))) {
      obj[key] = value;
    }
  }
  return obj;
};

});

require.register("teamsnap", function(exports, require, module) {
var Collection, Item, TeamSnap, promises, _ref;

promises = require('./promises');

_ref = require('./model'), Collection = _ref.Collection, Item = _ref.Item;

require('./errors');

TeamSnap = (function() {
  TeamSnap.prototype.version = '1.1.0';

  TeamSnap.prototype.promises = promises;

  TeamSnap.prototype.when = promises.when;

  TeamSnap.prototype.TeamSnap = TeamSnap;

  TeamSnap.prototype.Collection = Collection;

  TeamSnap.prototype.Item = Item;

  function TeamSnap(apiUrl, authUrl) {
    this.apiUrl = apiUrl != null ? apiUrl : 'https://apiv3.teamsnap.com';
    this.authUrl = authUrl != null ? authUrl : 'https://auth.teamsnap.com';
  }

  return TeamSnap;

})();

module.exports = new TeamSnap();

require('./auth');

require('./sdk');

if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

});

;require.register("types", function(exports, require, module) {
var plural, pluralLookup, singularLookup, teamTypes, teamsnap, type, typeLookup, types, _i, _len;

teamsnap = exports;

types = ['user', 'assignment', 'availability', 'contact', 'contactEmailAddress', 'contactPhoneNumber', 'customDatum', 'customField', 'event', 'location', 'member', 'memberEmailAddress', 'memberFile', 'memberLink', 'memberPhoneNumber', 'memberPreferences', 'opponent', 'opponentResults', 'plan', 'smsGateway', 'sponsor', 'sport', 'team', 'teamFile', 'teamPreferences', 'teamPublicSite', 'teamResults', 'timeZone', 'trackedItem', 'trackedItemStatus'];

teamTypes = types.slice();

teamTypes.remove = function(type) {
  var index;
  index = this.indexOf(type);
  if (index !== -1) {
    this.splice(index, 1);
  }
  return this;
};

teamTypes.remove('user').remove('plan').remove('smsGateway').remove('sport').remove('timeZone');

typeLookup = {};

singularLookup = {};

pluralLookup = {
  memberPreferences: 'membersPreferences',
  opponentResults: 'opponentsResults',
  teamPreferences: 'teamsPreferences',
  teamResults: 'teamsResults',
  customDatum: 'customData',
  smsGateway: 'smsGateways'
};

for (_i = 0, _len = types.length; _i < _len; _i++) {
  type = types[_i];
  plural = pluralLookup[type] || (function() {
    switch (type.slice(-1)) {
      case 'y':
        return type.slice(0, -1) + 'ies';
      case 's':
        return type + 'es';
      default:
        return type + 's';
    }
  })();
  typeLookup[type] = type;
  typeLookup[plural] = type;
  singularLookup[plural] = type;
  pluralLookup[type] = plural;
}

teamsnap.isPluralType = function(name) {
  return singularLookup.hasOwnProperty(name);
};

teamsnap.isSingularType = function(name) {
  return pluralLookup.hasOwnProperty(name);
};

teamsnap.hasType = function(type) {
  return typeLookup[type] !== void 0;
};

teamsnap.getTypes = function() {
  return types.slice();
};

teamsnap.getTeamTypes = function() {
  return teamTypes.slice();
};

teamsnap.getPluralType = function(name) {
  return pluralLookup[name];
};

teamsnap.getSingularType = function(name) {
  return singularLookup[name];
};

teamsnap.getType = function(name) {
  return typeLookup[name];
};

teamsnap.camelcaseType = function(type) {
  return type.replace(/[-_]+(\w)/g, function(_, char) {
    return char.toUpperCase();
  });
};

teamsnap.underscoreType = function(type) {
  return type.replace(/[A-Z]/g, function(char) {
    return '_' + char.toLowerCase();
  });
};

});


global['teamsnap'] = require('teamsnap');
})();