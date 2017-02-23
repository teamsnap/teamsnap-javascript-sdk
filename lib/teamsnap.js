(function() {
var window, global = {};
(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
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
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();
var require = global.require;
global = this;
if (global.window) window = this;
require.register("auth.coffee", function(exports, require, module) {
var TeamSnap, authRequest, browserStorageName, browserStore, collectionJSONMime, createAuthDialog, jsonMime, multipartMime, promises, request, sdkRequest;

TeamSnap = require('./teamsnap').TeamSnap;

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
    } catch (error) {
      e = error;
      return;
    }
    clearInterval(interval);
    dialog.close();
    response = {};
    params.split('&').forEach(function(param) {
      var key, ref, value;
      ref = param.split('='), key = ref[0], value = ref[1];
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

require.register("collections/assignments.coffee", function(exports, require, module) {
exports.EVENT_SETS = ['future_games_and_events', 'future_games', 'future_events'];

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
  var ref;
  if (!assignment) {
    throw new TSArgsError('teamsnap.saveAssignment', "`assignment` must be provided");
  }
  if (!this.isItem(assignment, 'assignment')) {
    throw new TSArgsError('teamsnap.saveAssignment', "`assignment.type` must be 'assignment'");
  }
  if (!assignment.eventId) {
    return this.reject('You must choose an event.', 'eventId', callback);
  }
  if (!((ref = assignment.description) != null ? ref.trim() : void 0)) {
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
      if (typeof (valueA != null ? valueA.localeCompare : void 0) === 'function') {
        return valueA.localeCompare(valueB);
      } else {
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
      }
    };
  })(this);
};

exports.sendAssignmentEmails = function(teamId, eventIds, message, sendingMemberId, callback) {
  var params;
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.sendAssignmentEmails', "must provide a `teamId`");
  }
  if (!eventIds) {
    throw new TSArgsError('teamsnap.sendAssignmentEmails', "must provide `eventIds`");
  }
  if (this.isItem(eventIds)) {
    eventIds = eventIds.id;
  }
  if (!this.isId(sendingMemberId)) {
    throw new TSArgsError('teamsnap.sendAssignmentEmails', "must provide a `sendingMemberId`");
  }
  params = {
    teamId: teamId,
    eventIds: eventIds,
    message: message,
    sendingMemberId: sendingMemberId
  };
  return this.collections.assignments.exec('sendAssignmentEmails', params, callback);
};

exports.reorderAssignments = function(eventId, assignmentIds, callback) {
  var params;
  if (!this.isId(eventId)) {
    throw new TSArgsError('teamsnap.reorderAssignments', '`eventId` must be provided');
  }
  if (!(assignmentIds && Array.isArray(assignmentIds))) {
    throw new TSArgsError('teamsnap.reorderAssignments', 'You must provide an array of ordered Assignments IDs');
  }
  params = {
    eventId: eventId,
    sortedIds: assignmentIds
  };
  return this.collections.assignments.exec('reorderAssignments', params).callback(callback);
};

exports.createBulkAssignments = function(eventSet, description, teamId, createAsMemberId, callback) {
  var params;
  if (!(this.EVENT_SETS.indexOf(eventSet) > -1)) {
    throw new TSArgsError('teamsnap.createBulkAssignments', " `eventSet` must be one of the following: " + this.EVENT_SETS.toString() + ".");
  }
  if (!description.trim()) {
    return this.reject('You must provide a description for the assignments.', 'description', callback);
  }
  if (!teamId) {
    throw new TSArgsError('teamsnap.createBulkAssignments', '`teamId` must be provided.');
  }
  if (this.isItem(teamId, 'team')) {
    ({
      teamId: teamId.id
    });
  }
  if (!createAsMemberId) {
    throw new TSArgsError('teamsnap.createBulkAssignments', '`createAsMemberId` must be provided.');
  }
  if (this.isItem(createAsMemberId, 'member')) {
    ({
      createAsMemberId: createAsMemberId.id
    });
  }
  params = {
    eventSet: eventSet,
    description: description,
    teamId: teamId,
    createAsMemberId: createAsMemberId
  };
  return this.collections.assignments.exec('createBulkAssignments', params, callback);
};

});

require.register("collections/availabilities.coffee", function(exports, require, module) {
var key, ref, statuses, value;

exports.AVAILABILITIES = {
  NONE: null,
  NO: 0,
  YES: 1,
  MAYBE: 2
};

statuses = {};

ref = exports.AVAILABILITIES;
for (key in ref) {
  value = ref[key];
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

require.register("collections/broadcastAlerts.coffee", function(exports, require, module) {
exports.loadBroadcastAlerts = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadBroadcastAlerts', 'must provide a teamId or query parameters');
  }
  return this.loadItems('broadcastAlert', params, callback);
};

exports.createBroadcastAlert = function(data) {
  return this.createItem(data, {
    type: 'broadcastAlert'
  });
};

exports.saveBroadcastAlert = function(broadcastAlert, callback) {
  var ref;
  if (!broadcastAlert) {
    throw new TSArgsError('teamsnap.saveBroadcastAlert', "`broadcastAlert` must be provided");
  }
  if (!this.isItem(broadcastAlert, 'broadcastAlert')) {
    throw new TSArgsError('teamsnap.saveBroadcastAlert', "`type` must be 'broadcastAlert'");
  }
  if (!broadcastAlert.teamId) {
    return this.reject('You must provide a team id.', 'teamId', callback);
  }
  if (!broadcastAlert.memberId) {
    return this.reject('You must provide a member id.', 'memberId', callback);
  }
  if (!((ref = broadcastAlert.body) != null ? ref.trim() : void 0)) {
    return this.reject('You must provide the text alert body.', 'body', callback);
  }
  return this.saveItem(broadcastAlert, callback);
};

exports.deleteBroadcastAlert = function(broadcastAlert, callback) {
  if (!broadcastAlert) {
    throw new TSArgsError('teamsnap.deleteBroadcastAlert', '`broadcastAlert` must be provided');
  }
  return this.deleteItem(broadcastAlert, callback);
};

});

require.register("collections/broadcastEmailAttachments.coffee", function(exports, require, module) {
exports.loadBroadcastEmailAttachments = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadBroadcastEmailAttachments', 'must provide a teamId or query parameters');
  }
  return this.loadItems('broadcastEmailAttachment', params, callback);
};

exports.deleteBroadcastEmailAttachment = function(broadcastEmailAttachment, callback) {
  if (!broadcastEmailAttachment) {
    throw new TSArgsError('teamsnap.deleteBroadcastEmailAttachment', '`broadcastEmailAttachment` must be provided');
  }
  return this.deleteItem(broadcastEmailAttachment, callback);
};

exports.uploadBroadcastEmailAttachment = function(broadcastEmailId, memberId, file, progressCallback, callback) {
  var params;
  if (typeof FormData === 'undefined') {
    this.reject('Your browser does not support the new file upload APIs.', 'file', callback);
  }
  if (!broadcastEmailId) {
    throw new TSArgsError('teamsnap.uploadBroadcastEmailAttachment', 'broadcastEmailId is required');
  }
  if (!(file instanceof File)) {
    throw new TSArgsError('teamsnap.uploadBroadcastEmailAttachment', 'must include `file` as type File', 'file is required');
  }
  if (!memberId) {
    throw new TSArgsError('teamsnap.uploadBroadcastEmailAttachment', 'memberId is required');
  }
  params = {
    broadcastEmailId: broadcastEmailId,
    file: file,
    memberId: memberId
  };
  return this.collections.broadcastEmailAttachments.file('uploadBroadcastEmailAttachment', params, progressCallback, callback);
};

});

require.register("collections/broadcastEmails.coffee", function(exports, require, module) {
exports.loadBroadcastEmails = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadBroadcastEmails', 'must provide a teamId or query parameters');
  }
  return this.loadItems('broadcastEmail', params, callback);
};

exports.createBroadcastEmail = function(data) {
  return this.createItem(data, {
    type: 'broadcastEmail'
  });
};

exports.saveBroadcastEmail = function(broadcastEmail, callback) {
  var ref;
  if (!broadcastEmail) {
    throw new TSArgsError('teamsnap.saveBroadcastEmail', "`broadcastEmail` must be provided");
  }
  if (!this.isItem(broadcastEmail, 'broadcastEmail')) {
    throw new TSArgsError('teamsnap.saveBroadcastEmail', "`type` must be 'broadcastEmail'");
  }
  if (broadcastEmail.isLeague) {
    if (!broadcastEmail.divisionId) {
      return reject('You must provide a division id.', 'divisionId', callback);
    }
  } else {
    if (!broadcastEmail.teamId) {
      return this.reject('You must provide a team id.', 'teamId', callback);
    }
  }
  if (!broadcastEmail.memberId) {
    return this.reject('You must provide a member id.', 'memberId', callback);
  }
  if (!((ref = broadcastEmail.body) != null ? ref.trim() : void 0)) {
    return this.reject('You must provide the text alert body.', 'body', callback);
  }
  if (!broadcastEmail.isDraft) {
    if (!broadcastEmail.isLeague) {
      if (!(Array.isArray(broadcastEmail.recipientIds) && broadcastEmail.recipientIds.length > 0)) {
        return this.reject('You must provide at least one recipient.', 'recipientIds');
      }
    }
  }
  return this.saveItem(broadcastEmail, callback);
};

exports.deleteBroadcastEmail = function(broadcastEmail, callback) {
  if (!broadcastEmail) {
    throw new TSArgsError('teamsnap.deleteBroadcastEmail', '`broadcastEmail` must be provided');
  }
  return this.deleteItem(broadcastEmail, callback);
};

exports.bulkDeleteBroadcastEmails = function(broadcastEmailIds, callback) {
  if (!(Array.isArray(broadcastEmailIds))) {
    throw new TSArgsError('teamsnap.broadcastEmailIds', 'You must provide an array of broadcastEmail IDs');
  }
  return this.collections.broadcastEmails.exec('bulkDelete', {
    id: broadcastEmailIds
  }, callback);
};

});

require.register("collections/contactEmailAddresses.coffee", function(exports, require, module) {
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

exports.saveContactEmailAddress = function(contactEmailAddress, callback) {
  if (!contactEmailAddress) {
    throw new TSArgsError('teamsnap.saveContactEmailAddress', '`contactEmailAddress` must be provided');
  }
  if (!this.isItem(contactEmailAddress, 'contactEmailAddress')) {
    throw new TSArgsError('teamsnap.saveContactEmailAddress', "`contactEmailAddress.type` must be 'contactEmailAddress'");
  }
  if (!contactEmailAddress.contactId) {
    return this.reject('You must choose a contact.', 'contactId', callback);
  }
  return this.saveItem(contactEmailAddress, callback);
};

exports.deleteContactEmailAddress = function(contactEmailAddress, callback) {
  if (!contactEmailAddress) {
    throw new TSArgsError('teamsnap.deleteContactEmailAddress', '`contactEmailAddress` must be provided');
  }
  return this.deleteItem(contactEmailAddress, callback);
};

});

require.register("collections/contactPhoneNumbers.coffee", function(exports, require, module) {
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

exports.saveContactPhoneNumber = function(contactPhoneNumber, callback) {
  if (!contactPhoneNumber) {
    throw new TSArgsError('teamsnap.saveContactPhoneNumber', '`contactPhoneNumber` must be provided');
  }
  if (!this.isItem(contactPhoneNumber, 'contactPhoneNumber')) {
    throw new TSArgsError('teamsnap.saveContactPhoneNumber', "`contactPhoneNumber.type` must be 'contactPhoneNumber'");
  }
  if (!contactPhoneNumber.contactId) {
    return this.reject('You must choose a contact.', 'contactId', callback);
  }
  return this.saveItem(contactPhoneNumber, callback);
};

exports.deleteContactPhoneNumber = function(contactPhoneNumber, callback) {
  if (!contactPhoneNumber) {
    throw new TSArgsError('teamsnap.deleteContactPhoneNumber', '`contactPhoneNumber` must be provided');
  }
  return this.deleteItem(contactPhoneNumber, callback);
};

});

require.register("collections/contacts.coffee", function(exports, require, module) {
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
  var ref;
  if (!contact) {
    throw new TSArgsError('teamsnap.saveContact', "`contact` must be provided");
  }
  if (!this.isItem(contact, 'contact')) {
    throw new TSArgsError('teamsnap.saveContact', "`contact.type` must be 'contact'");
  }
  if (!contact.memberId) {
    return this.reject('You must choose a member.', 'memberId', callback);
  }
  if (!((ref = contact.firstName) != null ? ref.trim() : void 0)) {
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

require.register("collections/customData.coffee", function(exports, require, module) {
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

exports.createCustomDatum = function(data, field) {
  return this.createItem(data, {
    type: 'customDatum',
    customFieldId: field.id,
    kind: field.kind,
    name: field.name,
    isPrivate: false,
    value: null
  });
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

require.register("collections/customFields.coffee", function(exports, require, module) {
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

require.register("collections/divisionEvents.coffee", function(exports, require, module) {
exports.loadDivisionEvents = function(params, callback) {
  if (this.isId(params)) {
    params = {
      divisionId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadDivisionEvents', 'must provide a divisionId or query parameters');
  }
  return this.loadItems('divisionEvent', params, callback);
};

});

require.register("collections/divisionLocations.coffee", function(exports, require, module) {
exports.loadDivisionLocations = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadDivisionLocations', 'must provide a teamId or query parameters');
  }
  return this.loadItems('divisionLocation', params, callback);
};

});

require.register("collections/divisionMembers.coffee", function(exports, require, module) {
exports.loadDivisionMembers = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadDivisionMembers', 'must provide a teamId or query parameters');
  }
  return this.loadItems('divisionMember', params, callback);
};

});

require.register("collections/divisionMembersPreferences.coffee", function(exports, require, module) {
exports.PREFS = {
  SCHEDULE_SHOW: {
    ALL: 1,
    GAMES: 2,
    EVENTS: 3
  }
};

exports.loadDivisionMembersPreferences = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadDivisionMembersPreferences', 'must provide a teamId or query parameters');
  }
  return this.loadItems('divisionMemberPreferences', params, callback);
};

exports.loadDivisionMemberPreferences = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadDivisionMemberPreferences', 'must provide a teamId or query parameters');
  }
  return this.loadItem('divisionMemberPreferences', params, callback);
};

exports.saveDivisionMemberPreferences = function(divisionMemberPreferences, callback) {
  if (!divisionMemberPreferences) {
    throw new TSArgsError('teamsnap.saveDivisionMemberPreferences', "`divisionMemberPreferences` must be provided");
  }
  if (!this.isItem(divisionMemberPreferences, 'divisionMemberPreferences')) {
    throw new TSArgsError('teamsnap.saveDivisionMemberPreferences', "`divisionMemberPreferences.type` must be 'divisionMemberPreferences'");
  }
  return this.saveItem(divisionMemberPreferences, callback);
};

});

require.register("collections/divisionTeamStandings.coffee", function(exports, require, module) {
exports.loadDivisionTeamStandings = function(teamId, callback) {
  var params;
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.loadDivisionTeamStandings', 'must provide a teamId');
  }
  params = {
    teamId: teamId
  };
  return this.loadItems('divisionTeamStanding', params, callback);
};

});

require.register("collections/divisions.coffee", function(exports, require, module) {
exports.loadDivisions = function(params, callback) {
  if (params == null) {
    params = {};
  }
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }
  if (Object.keys(params).length) {
    return this.loadItems('division', params, callback);
  } else {
    return this.loadMe().then((function(_this) {
      return function(me) {
        params.userId = me.id;
        return _this.loadItems('division', params, callback);
      };
    })(this));
  }
};

exports.loadDivision = function(divisionId, callback) {
  if (!this.isId(divisionId)) {
    throw new TSArgsError('teamsnap.loadDivision', 'divisionId must be provided');
  }
  return this.loadItem('division', {
    id: divisionId
  }, callback);
};

exports.createDivision = function(data) {
  return this.createItem(data, {
    type: 'division',
    name: ''
  });
};

exports.saveDivision = function(division, callback) {
  var ref;
  if (!division) {
    throw new TSArgsError('teamsnap.saveDivision', "`division` must be provided");
  }
  if (!this.isItem(division, 'division')) {
    throw new TSArgsError('teamsnap.saveDivision', "`type` must be 'division'");
  }
  if (!((ref = division.name) != null ? ref.trim() : void 0)) {
    return this.reject('You must provide a name for the division.', 'name', callback);
  }
  return this.saveItem(division, callback);
};

exports.deleteDivision = function(division, callback) {
  if (!division) {
    throw new TSArgsError('teamsnap.deleteDivision', '`division` must be provided');
  }
  return this.deleteItem(division, callback);
};

exports.loadAncestorDivisions = function(divisionId, callback) {
  if (!this.isId(divisionId)) {
    throw new TSArgsError('teamsnap.loadAncestorDivisions', 'divisionId must be provided');
  }
  return this.collections.divisions.queryItems('ancestors', {
    id: divisionId
  }, callback);
};

exports.loadDescendantDivisions = function(divisionId, callback) {
  if (!this.isId(divisionId)) {
    throw new TSArgsError('teamsnap.loadDescendantDivisions', 'divisionId must be provided');
  }
  return this.collections.divisions.queryItems('descendants', {
    id: divisionId
  }, callback);
};

exports.loadChildDivisions = function(divisionId, callback) {
  if (!this.isId(divisionId)) {
    throw new TSArgsError('teamsnap.loadChildDivisions', 'divisionId must be provided');
  }
  return this.collections.divisions.queryItems('children', {
    id: divisionId
  }, callback);
};

exports.loadActiveTrialDivisions = function(userId, callback) {
  if (!this.isId(userId)) {
    throw new TSArgsError('teamsnap.loadActiveTrialsDivisions', 'userId must be provided');
  }
  return this.collections.divisions.queryItems('activeTrials', {
    userId: userId
  }, callback);
};

});

require.register("collections/divisionsPreferences.coffee", function(exports, require, module) {
exports.loadDivisionsPreferences = function(params, callback) {
  if (this.isId(params)) {
    params = {
      divisionId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadDivisionsPreferences', 'must provide a divisionId or query parameters');
  }
  return this.loadItems('divisionPreferences', params, callback);
};

exports.loadDivisionPreferences = function(params, callback) {
  if (this.isId(params)) {
    params = {
      divisionId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadDivisionPreferences', 'must provide a divisionId or query parameters');
  }
  return this.loadItem('divisionPreferences', params, callback);
};

exports.saveDivisionPreferences = function(divisionPreferences, callback) {
  if (!divisionPreferences) {
    throw new TSArgsError('teamsnap.saveDivisionPreferences', "`divisionPreferences` must be provided");
  }
  if (!this.isItem(divisionPreferences, 'divisionPreferences')) {
    throw new TSArgsError('teamsnap.saveDivisionPreferences', "`divisionPreferences.type` must be 'divisionPreferences'");
  }
  return this.saveItem(divisionPreferences, callback);
};

});

require.register("collections/eventStatistics.coffee", function(exports, require, module) {
exports.loadEventStatistics = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadEventStatistics', 'must provide a teamId or query parameters');
  }
  return this.loadItems('eventStatistic', params, callback);
};

});

require.register("collections/events.coffee", function(exports, require, module) {
var includes, key, ref, value;

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

ref = exports.EVENTS;
for (key in ref) {
  value = ref[key];
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
  var ref1, ref2;
  if (!event) {
    throw new TSArgsError('teamsnap.saveEvent', "`event` must be provided");
  }
  if (!this.isItem(event, 'event')) {
    throw new TSArgsError('teamsnap.saveEvent', "`event.type` must be 'event'");
  }
  if (!(event.isGame || ((ref1 = event.name) != null ? ref1.trim() : void 0))) {
    return this.reject('You must provide a name.', 'name', callback);
  }
  if (!event.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!(event.locationId || event.divisionLocationId)) {
    return this.reject('You must choose a location.', 'locationId', callback);
  }
  if (event.isGame && !event.opponentId) {
    return this.reject('You must choose an opponent.', 'opponentId', callback);
  }
  if (isNaN((ref2 = event.startDate) != null ? ref2.getTime() : void 0)) {
    return this.reject('You must provide a valid start date.', 'startDate', callback);
  }
  if (event.notifyTeam && !event.notifyTeamAsMemberId) {
    return this.reject('You must provide the current member\'s id.', 'notifyTeamAsMemberId', callback);
  }
  return this.saveItem(event, callback);
};

exports.deleteEvent = function(event, include, notify, notifyAs, callback) {
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
    if (!notifyAs) {
      throw new TSArgsError('teamsnap.deleteEvent', '`notifyTeamAsMemberId` must be provided');
    }
    params.notifyTeamAsMemberId = notifyAs;
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
  } else if (this.isItem(sendingMemberId, 'divisionMember')) {
    sendingMemberId = sendingMemberId.id;
  }
  if (!this.isId(eventId)) {
    throw new TSArgsError('teamsnap.sendAvailabilityReminders', 'must include id `eventId`');
  }
  if (!this.isId(sendingMemberId)) {
    throw new TSArgsError('teamsnap.sendAvailabilityReminders', 'must include id `sendingMemberId`');
  }
  if (!Array.isArray(include)) {
    throw new TSArgsError('teamsnap.sendAvailabilityReminders', "`include` must be an array of member ids");
  }
  if ((include == null) || include.length === 0) {
    throw new TSArgsError('teamsnap.sendAvailabilityReminders', "`include` must be an array of member ids");
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

exports.bulkCreateEvents = function(params, callback) {
  var options;
  if (!params.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!Array.isArray(params.events)) {
    throw new TSArgsError('teamsnap.bulkCreateEvents', "`events` must be an array of events");
  }
  options = {
    templates: params.events,
    teamId: params.teamId,
    notifyTeamAsMemberId: params.sendingMemberId,
    notifyTeam: params.notifyTeam
  };
  return this.collections.events.exec('bulkCreate', options, callback);
};

});

require.register("collections/facebookPages.coffee", function(exports, require, module) {
exports.loadFacebookPages = function(callback) {
  var params;
  params = {};
  return this.loadItems('facebookPage', params, callback);
};

});

require.register("collections/forumPosts.coffee", function(exports, require, module) {
exports.loadForumPosts = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadForumPosts', 'must provide a teamId or query parameters');
  }
  return this.loadItems('forumPost', params, callback);
};

exports.createForumPost = function(data) {
  return this.createItem(data, {
    type: 'forumPost'
  });
};

exports.saveForumPost = function(forumPost, callback) {
  var ref;
  if (!forumPost) {
    throw new TSArgsError('teamsnap.saveForumPost', "`forumPost` must be provided");
  }
  if (!this.isItem(forumPost, 'forumPost')) {
    throw new TSArgsError('teamsnap.saveForumPost', "`type` must be 'forumPost'");
  }
  if (!forumPost.forumTopicId) {
    return this.reject('You must provide a forum topic id.', 'forumTopicId', callback);
  }
  if (!forumPost.memberId) {
    return this.reject('You must provide a member id.', 'memberId', callback);
  }
  if (!((ref = forumPost.message) != null ? ref.trim() : void 0)) {
    return this.reject('You must provide a message for the forum post.', 'message', callback);
  }
  return this.saveItem(forumPost, callback);
};

exports.deleteForumPost = function(forumPost, callback) {
  if (!forumPost) {
    throw new TSArgsError('teamsnap.deleteForumPost', '`forumPost` must be provided');
  }
  return this.deleteItem(forumPost, callback);
};

});

require.register("collections/forumSubscriptions.coffee", function(exports, require, module) {
exports.loadForumSubscriptions = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadForumSubscriptions', 'must provide a teamId or query parameters');
  }
  return this.loadItems('forumSubscription', params, callback);
};

exports.createForumSubscription = function(data) {
  return this.createItem(data, {
    type: 'forumSubscription'
  });
};

exports.saveForumSubscription = function(forumSubscription, callback) {
  if (!forumSubscription) {
    throw new TSArgsError('teamsnap.saveForumSubscription', "`forumSubscription` must be provided");
  }
  if (!this.isItem(forumSubscription, 'forumSubscription')) {
    throw new TSArgsError('teamsnap.saveForumSubscription', "`type` must be 'forumSubscription'");
  }
  if (!forumSubscription.forumTopicId) {
    return this.reject('You must provide a forum topic id.', 'forumTopicId', callback);
  }
  if (!forumSubscription.memberId) {
    return this.reject('You must provide a member id.', 'memberId', callback);
  }
  return this.saveItem(forumSubscription, callback);
};

exports.deleteForumSubscription = function(forumSubscription, callback) {
  if (!forumSubscription) {
    throw new TSArgsError('teamsnap.deleteForumSubscription', '`forumSubscription` must be provided');
  }
  return this.deleteItem(forumSubscription, callback);
};

});

require.register("collections/forumTopics.coffee", function(exports, require, module) {
exports.loadForumTopics = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadForumTopics', 'must provide a teamId or query parameters');
  }
  return this.loadItems('forumTopic', params, callback);
};

exports.createForumTopic = function(data) {
  return this.createItem(data, {
    type: 'forumTopic'
  });
};

exports.saveForumTopic = function(forumTopic, callback) {
  var ref;
  if (!forumTopic) {
    throw new TSArgsError('teamsnap.saveForumTopic', "`forumTopic` must be provided");
  }
  if (!this.isItem(forumTopic, 'forumTopic')) {
    throw new TSArgsError('teamsnap.saveForumTopic', "`type` must be 'forumTopic'");
  }
  if (!forumTopic.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!((ref = forumTopic.title) != null ? ref.trim() : void 0)) {
    return this.reject('You must provide a title for the forum topic.', 'title', callback);
  }
  return this.saveItem(forumTopic, callback);
};

exports.deleteForumTopic = function(forumTopic, callback) {
  if (!forumTopic) {
    throw new TSArgsError('teamsnap.deleteForumTopic', '`forumTopic` must be provided');
  }
  return this.deleteItem(forumTopic, callback);
};

});

require.register("collections/leagueCustomData.coffee", function(exports, require, module) {
exports.loadLeagueCustomData = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadLeagueCustomData', 'must provide a teamId or query parameters');
  }
  return this.loadItems('leagueCustomDatum', params, callback);
};

exports.createLeagueCustomDatum = function(data, field) {
  return this.createItem(data, {
    type: 'leagueCustomDatum',
    leagueCustomFieldId: field.id,
    kind: field.kind,
    name: field.name,
    isPrivate: false,
    value: null
  });
};

exports.saveLeagueCustomDatum = function(leagueCustomDatum, callback) {
  if (!leagueCustomDatum) {
    throw new TSArgsError('teamsnap.saveLeagueCustomDatum', '`leagueCustomDatum` must be provided');
  }
  if (!this.isItem(leagueCustomDatum, 'leagueCustomDatum')) {
    throw new TSArgsError('teamsnap.saveLeagueCustomDatum', "`leagueCustomDatum.type` must be 'leagueCustomDatum'");
  }
  return this.saveItem(leagueCustomDatum, callback);
};

});

require.register("collections/leagueCustomFields.coffee", function(exports, require, module) {
exports.loadLeagueCustomFields = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadLeagueCustomFields', 'must provide a teamId or query parameters');
  }
  return this.loadItems('leagueCustomField', params, callback);
};

});

require.register("collections/leagueRegistrantDocuments.coffee", function(exports, require, module) {
exports.loadLeagueRegistrantDocuments = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadLeagueRegistrantDocuments', 'must provide a teamId or query parameters');
  }
  return this.loadItems('leagueRegistrantDocument', params, callback);
};

});

require.register("collections/locations.coffee", function(exports, require, module) {
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
  var ref;
  if (!location) {
    throw new TSArgsError('teamsnap.saveLocation', "`location` must be provided");
  }
  if (!this.isItem(location, 'location')) {
    throw new TSArgsError('teamsnap.saveLocation', "`location.type` must be 'location'");
  }
  if (!location.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!((ref = location.name) != null ? ref.trim() : void 0)) {
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

require.register("collections/memberAssignments.coffee", function(exports, require, module) {
exports.loadMemberAssignments = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberAssignments', 'must provide a teamId or query parameters');
  }
  return this.loadItems('memberAssignment', params, callback);
};

exports.createMemberAssignment = function(data) {
  return this.createItem(data, {
    type: 'memberAssignment'
  });
};

exports.saveMemberAssignment = function(memberAssignment, callback) {
  if (!memberAssignment) {
    throw new TSArgsError('teamsnap.saveMemberAssignment', "`memberAssignment` must be provided");
  }
  if (!this.isItem(memberAssignment, 'memberAssignment')) {
    throw new TSArgsError('teamsnap.saveMemberAssignment', "`memberAssignment.type` must be 'memberAssignment'");
  }
  return this.saveItem(memberAssignment, callback);
};

exports.deleteMemberAssignment = function(memberAssignment, callback) {
  if (!memberAssignment) {
    throw new TSArgsError('teamsnap.deleteMemberAssignment', '`memberAssignment` must be provided');
  }
  return this.deleteItem(memberAssignment, callback);
};

});

require.register("collections/memberBalances.coffee", function(exports, require, module) {
exports.loadMemberBalances = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberBalances', 'must provide a teamId or query parameters');
  }
  return this.loadItems('memberBalance', params, callback);
};

});

require.register("collections/memberEmailAddresses.coffee", function(exports, require, module) {
exports.INVITED_STATES = ["new", "new_user", "existing_user"];

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

exports.inviteMemberEmailAddresses = function(options, callback) {
  if (!options.memberEmailAddressIds) {
    throw new TSArgsError('teamsnap.inviteMemberEmailAddresses', 'options.memberEmailAddressIds is required.');
  }
  if (!options.memberId) {
    throw new TSArgsError('teamsnap.inviteMemberEmailAddresses', 'options.memberId is required.');
  }
  if (!options.teamId) {
    throw new TSArgsError('teamsnap.inviteMemberEmailAddresses', 'options.teamId is required.');
  }
  if (!options.notifyAsMemberId) {
    throw new TSArgsError('teamsnap.inviteMemberEmailAddresses', 'options.notifyAsMemberId is required.');
  }
  return this.collections.memberEmailAddresses.exec('invite', options).pop().callback(callback);
};

exports.saveMemberEmailAddress = function(memberEmailAddress, callback) {
  if (!memberEmailAddress) {
    throw new TSArgsError('teamsnap.saveMemberEmailAddress', '`memberEmailAddress` must be provided');
  }
  if (!this.isItem(memberEmailAddress, 'memberEmailAddress')) {
    throw new TSArgsError('teamsnap.saveMemberEmailAddress', "`memberEmailAddress.type` must be 'memberEmailAddress'");
  }
  if (!memberEmailAddress.memberId) {
    return this.reject('You must choose a member.', 'memberId', callback);
  }
  return this.saveItem(memberEmailAddress, callback);
};

exports.deleteMemberEmailAddress = function(memberEmailAddress, callback) {
  if (!memberEmailAddress) {
    throw new TSArgsError('teamsnap.deleteMemberEmailAddress', '`memberEmailAddress` must be provided');
  }
  return this.deleteItem(memberEmailAddress, callback);
};

});

require.register("collections/memberFiles.coffee", function(exports, require, module) {
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

require.register("collections/memberLinks.coffee", function(exports, require, module) {
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

require.register("collections/memberPayments.coffee", function(exports, require, module) {
exports.loadMemberPayments = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberPayments', 'must provide a teamId or query parameters');
  }
  return this.loadItems('memberPayment', params, callback);
};

exports.saveMemberPayment = function(memberPayment, callback) {
  if (!memberPayment) {
    throw new TSArgsError('teamsnap.saveMemberPayment', '`memberPayment` must be provided');
  }
  if (!this.isItem(memberPayment, 'memberPayment')) {
    throw new TSArgsError('teamsnap.saveMemberPayment', "`memberPayment.type` must be 'memberPayment'");
  }
  if (!memberPayment.memberId) {
    return this.reject('You must choose a member.', 'memberId', callback);
  }
  return this.saveItem(memberPayment, callback);
};

exports.memberPaymentTransaction = function(memberPaymentId, amount, note, callback) {
  var params;
  if (!this.isItem(memberPaymentId)) {
    throw new TSArgsError('teamsnap.memberPaymentTransaction', "must provide a `memberPaymentId`");
  }
  if (this.isItem(memberPaymentId)) {
    memberPaymentId = memberPaymentId.id;
  }
  if (!amount) {
    return this.reject('You must add an amount.', 'amount', callback);
  }
  if (typeof note === 'function') {
    callback = note;
  }
  params = {
    memberPaymentId: memberPaymentId,
    amount: amount,
    note: note
  };
  return this.collections.memberPayments.exec('transaction', params).pop().callback(callback);
};

});

require.register("collections/memberPhoneNumbers.coffee", function(exports, require, module) {
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

exports.saveMemberPhoneNumber = function(memberPhoneNumber, callback) {
  if (!memberPhoneNumber) {
    throw new TSArgsError('teamsnap.saveMemberPhoneNumber', '`memberPhoneNumber` must be provided');
  }
  if (!this.isItem(memberPhoneNumber, 'memberPhoneNumber')) {
    throw new TSArgsError('teamsnap.saveMemberPhoneNumber', "`memberPhoneNumber.type` must be 'memberPhoneNumber'");
  }
  if (!memberPhoneNumber.memberId) {
    return this.reject('You must choose a member.', 'memberId', callback);
  }
  return this.saveItem(memberPhoneNumber, callback);
};

exports.deleteMemberPhoneNumber = function(memberPhoneNumber, callback) {
  if (!memberPhoneNumber) {
    throw new TSArgsError('teamsnap.deleteMemberPhoneNumber', '`memberPhoneNumber` must be provided');
  }
  return this.deleteItem(memberPhoneNumber, callback);
};

});

require.register("collections/memberPhotos.coffee", function(exports, require, module) {
exports.loadMemberPhotos = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberPhotos', 'must provide a `teamId` or query parameters');
  }
  return this.loadItems('memberPhoto', params, callback);
};

exports.loadMemberPhoto = function(params, callback) {
  if (this.isId(params)) {
    params = {
      id: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberPhoto', 'must provide an `id` or query parameters');
  }
  return this.loadItem('memberPhoto', params, callback);
};

});

require.register("collections/memberRegistrationSignups.coffee", function(exports, require, module) {
exports.loadMemberRegistrationSignups = function(params, callback) {
  if (this.isId(params)) {
    params = {
      id: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberRegistrationSignups', 'must provide a id or query parameters');
  }
  return this.loadItems('memberRegistrationSignup', params, callback);
};

});

require.register("collections/memberStatistics.coffee", function(exports, require, module) {
exports.loadMemberStatistics = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMemberStatistics', 'must provide a teamId or query parameters');
  }
  return this.loadItems('memberStatistic', params, callback);
};

});

require.register("collections/members.coffee", function(exports, require, module) {
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
  var ref;
  if (!member) {
    throw new TSArgsError('teamsnap.saveMember', "`member` must be provided");
  }
  if (!this.isItem(member, 'member')) {
    throw new TSArgsError('teamsnap.saveMember', "`type` must be 'member'");
  }
  if (!member.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!((ref = member.firstName) != null ? ref.trim() : void 0)) {
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

exports.divisionLoadMembers = function(params, callback) {
  if (!params.divisionId) {
    throw new TSArgsError('teamsnap.divisionLoadMembers', "`divisionId` must be provided");
  }
  return this.collections.members.queryItems('divisionSearch', params, callback);
};

exports.divisionAdvancedLoadMembers = function(params, callback) {
  if (!params.divisionId) {
    throw new TSArgsError('teamsnap.divisionAdvancedLoadMembers', "`divisionId` must be provided");
  }
  return this.collections.members.queryItems('advancedDivisionSearch', params, callback);
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
      if (typeof (valueA != null ? valueA.localeCompare : void 0) === 'function') {
        return valueA.localeCompare(valueB);
      } else {
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
  if (item.type === 'member' && item.isOwner && !member.isOwner) {
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

exports.importMembersFromTeam = function(memberIds, teamId, sendInvites, callback) {
  var params;
  if (!memberIds) {
    throw new TSArgsError('teamsnap.importMembersFromTeam', 'must include `memberIds`');
  }
  if (!this.isItem(teamId)) {
    throw new TSArgsError('teamsnap.importMembersFromTeam', "must provide a teamId");
  }
  if (this.isItem(teamId)) {
    teamId = teamId.id;
  }
  params = {
    sourceMemberIds: memberIds,
    destinationTeamId: teamId
  };
  return this.collections.members.exec('importFromTeam', params, callback);
};

exports.loadImportableMembers = function(userId, includeArchivedTeams, callback) {
  var params;
  if (!userId) {
    throw new TSArgsError('teamsnap.loadImportableMembers', "must provide a userId");
  }
  if (typeof includeArchivedTeams === 'function') {
    callback = includeArchivedTeams;
  }
  params = {
    userId: userId,
    includeArchivedTeams: includeArchivedTeams
  };
  return this.collections.members.queryItems('importableMembers', params, callback);
};

exports.bulkDeleteMembers = function(members, callback) {
  if (Array.isArray(members)) {
    if (members.length === 0) {
      throw new TSArgsError('teamsnap.bulkDeleteMembers', 'The array of members to be deleted is empty.');
    } else if (members.every((function(_this) {
      return function(member) {
        return _this.isItem(member, 'member');
      };
    })(this))) {
      members = {
        memberId: members.map(function(member) {
          return member.id;
        })
      };
    } else {
      throw new TSArgsError('teamsnap.bulkDeleteMembers', 'Must provide an `array` of member `ids` or `member` objects');
    }
  } else if (typeof members === 'object' && this.isItem(members, 'member')) {
    members = {
      memberId: members.id
    };
  } else {
    throw new TSArgsError('teamsnap.bulkDeleteMembers', 'Must provide an `array` of members, or a `member` object');
  }
  return this.collections.members.exec('bulkDelete', members).callback(callback);
};

exports.moveMemberToTeam = function(params, callback) {
  if (!params.member) {
    throw new TSArgsError('teamsnap.moveMemberToTeam', 'params must include `member`');
  }
  if (!params.divisionId) {
    throw new TSArgsError('teamsnap.moveMemberToTeam', 'params must include `divisionId`');
  }
  if (Array.isArray(params.member)) {
    if (params.member.length === 0) {
      throw new TSArgsError('teamsnap.moveMemberToTeam', 'member in params is empty.');
    } else if (params.member.every((function(_this) {
      return function(member) {
        return _this.isItem(member, 'member');
      };
    })(this))) {
      params.memberId = params.member.map(function(member) {
        return member.id;
      });
    } else {
      throw new TSArgsError('teamsnap.moveMemberToTeam', 'Must provide an `array` of member objects or a `member` object for member');
    }
  } else if (this.isItem(params.member, 'member')) {
    params.memberId = params.member.id;
  } else {
    throw new TSArgsError('teamsnap.moveMemberToTeam', 'Must provide an `array` of member objects or `member` objects for member');
  }
  if (this.isItem(params.divisionId, 'division')) {
    params.divisionId = params.divisionId.id;
  }
  if (this.isItem(params.teamId, 'team')) {
    params.teamId = params.teamId.id;
  }
  return this.collections.members.exec('moveMember', params).callback(callback);
};

});

require.register("collections/membersPreferences.coffee", function(exports, require, module) {
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

});

require.register("collections/messageData.coffee", function(exports, require, module) {
exports.loadMessageData = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMessageData', 'must provide a teamId or query parameters');
  }
  return this.loadItems('messageDatum', params, callback);
};

});

require.register("collections/messages.coffee", function(exports, require, module) {
exports.loadMessages = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadMessages', 'must provide a teamId or query parameters');
  }
  return this.loadItems('message', params, callback);
};

exports.markMessageAsRead = function(params, callback) {
  if (typeof params === 'object') {
    params = {
      id: params.id
    };
  } else if (this.isId(params)) {
    params = {
      id: params
    };
  } else {
    throw new TSArgsError('teamsnap.markMessageAsRead', 'a message `id` or `message` object must be provided');
  }
  return this.collections.messages.exec('markMessageAsRead', params).pop().callback(callback);
};

exports.bulkDeleteMessages = function(messages, callback) {
  if (Array.isArray(messages)) {
    if (messages.length === 0) {
      throw new TSArgsError('teamsnap.bulkDeleteMessages', 'The array of messages to be deleted is empty.');
    } else if (this.isItem(messages[0], 'message')) {
      messages = {
        id: messages.map(function(message) {
          return message.id;
        })
      };
    } else if (this.isId(messages[0])) {
      messages = {
        id: messages
      };
    } else {
      throw new TSArgsError('teamsnap.bulkDeleteMessages', 'Must provide an `array` of message `ids` or `message` objects');
    }
  } else if (typeof messages === 'object' && this.isItem(messages, 'message')) {
    messages = {
      id: messages.id
    };
  } else if (this.isId(messages)) {
    messages = {
      id: messages
    };
  } else {
    throw new TSArgsError('teamsnap.bulkDeleteMessages', 'Must provide an `array` of message `ids`, an `id` or a `message` object');
  }
  return this.collections.messages.exec('bulkDelete', messages).callback(callback);
};

});

require.register("collections/opponents.coffee", function(exports, require, module) {
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
  var ref;
  if (!opponent) {
    throw new TSArgsError('teamsnap.saveOpponent', "`opponent` must be provided");
  }
  if (!this.isItem(opponent, 'opponent')) {
    throw new TSArgsError('teamsnap.saveOpponent', "`opponent.type` must be 'opponent'");
  }
  if (!opponent.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!((ref = opponent.name) != null ? ref.trim() : void 0)) {
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

require.register("collections/opponentsResults.coffee", function(exports, require, module) {
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

require.register("collections/paymentNotes.coffee", function(exports, require, module) {
exports.loadPaymentNotes = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadPaymentNotes', 'must provide a teamId or query parameters');
  }
  return this.loadItems('paymentNote', params, callback);
};

exports.createPaymentNote = function(data) {
  return this.createItem(data, {
    type: 'paymentNote'
  });
};

exports.savePaymentNote = function(paymentNote, callback) {
  if (!paymentNote) {
    throw new TSArgsError('teamsnap.savePaymentNote', '`paymentNote` must be provided');
  }
  if (!this.isItem(paymentNote, 'paymentNote')) {
    throw new TSArgsError('teamsnap.savePaymentNote', "`paymentNote.type` must be 'paymentNote'");
  }
  if (!paymentNote.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!paymentNote.memberPaymentId) {
    return this.reject('You must specify a memberPaymentId.', 'memberPaymentId', callback);
  }
  if (!paymentNote.note) {
    return this.reject('You must provide a note.', 'note', callback);
  }
  return this.saveItem(paymentNote, callback);
};

});

require.register("collections/plans.coffee", function(exports, require, module) {
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

require.register("collections/registrationForms.coffee", function(exports, require, module) {
exports.loadRegistrationForms = function(params, callback) {
  if (this.isId(params)) {
    params = {
      id: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadRegistrationForms', 'must provide a id or query parameters');
  }
  return this.loadItems('registrationForm', params, callback);
};

});

require.register("collections/sponsors.coffee", function(exports, require, module) {
exports.loadSponsors = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadSponsors', 'must provide a teamId or query parameters');
  }
  return this.loadItems('sponsor', params, callback);
};

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

require.register("collections/sports.coffee", function(exports, require, module) {
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

require.register("collections/statisticAggregates.coffee", function(exports, require, module) {
exports.loadStatisticAggregates = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadStatisticAggregates', 'must provide a teamId or query parameters');
  }
  return this.loadItems('statisticAggregate', params, callback);
};

});

require.register("collections/statisticData.coffee", function(exports, require, module) {
exports.loadStatisticData = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadStatisticData', 'must provide a teamId or query parameters');
  }
  return this.loadItems('statisticDatum', params, callback);
};

exports.createStatisticDatum = function(data) {
  return this.createItem(data, {
    type: 'statisticDatum'
  });
};

exports.saveStatisticDatum = function(statisticDatum, callback) {
  if (!statisticDatum) {
    throw new TSArgsError('teamsnap.saveStatisticDatum', '`statisticDatum` must be provided');
  }
  if (!this.isItem(statisticDatum, 'statisticDatum')) {
    throw new TSArgsError('teamsnap.saveStatisticDatum', "`statisticDatum.type` must be 'statisticDatum'");
  }
  if (!statisticDatum.eventId) {
    return this.reject('You must specify an event.', 'eventId', callback);
  }
  if (!statisticDatum.statisticId) {
    return this.reject('You must specify a statistic.', 'statisticId', callback);
  }
  if (!statisticDatum.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  return this.saveItem(statisticDatum, callback);
};

exports.deleteStatisticDatum = function(statisticDatum, callback) {
  if (!statisticDatum) {
    throw new TSArgsError('teamsnap.deleteStatisticDatum', '`statisticDatum` must be provided');
  }
  return this.deleteItem(statisticDatum, callback);
};

exports.bulkSaveStatisticData = function(templates, callback) {
  var params;
  if (!templates) {
    throw new TSArgsError('teamsnap.bulkSaveStatisticData', "`templates` must be provided");
  }
  params = {
    templates: templates
  };
  return this.collections.statisticData.exec('bulkUpdateStatisticData', params).callback(callback);
};

exports.bulkDeleteStatisticData = function(member, event, callback) {
  var params;
  if (!member) {
    throw new TSArgsError('teamsnap.bulkDeleteStatisticData', "`member` must be provided");
  }
  if (!this.isItem(member, 'member')) {
    throw new TSArgsError('teamsnap.bulkDeleteStatisticData', "`member.type` must be 'member'");
  }
  if (!event) {
    throw new TSArgsError('teamsnap.bulkDeleteStatisticData', "`event` must be provided");
  }
  if (!this.isItem(event, 'event')) {
    throw new TSArgsError('teamsnap.bulkDeleteStatisticData', "`event.type` must be 'event'");
  }
  params = {
    memberId: member.id,
    eventId: event.id
  };
  return this.collections.statisticData.exec('bulkDeleteStatisticData', params).callback(callback);
};

});

require.register("collections/statisticGroups.coffee", function(exports, require, module) {
exports.loadStatisticGroups = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadStatisticGroups', 'you must provide a a teamId or query parameters');
  }
  return this.loadItems('statisticGroup', params, callback);
};

exports.createStatisticGroup = function(data) {
  return this.createItem(data, {
    type: 'statisticGroup'
  });
};

exports.saveStatisticGroup = function(statisticGroup, callback) {
  if (!statisticGroup) {
    throw new TSArgsError('teamsnap.saveStatisticGroup', '`statisticGroup` must be provided');
  }
  if (!this.isItem(statisticGroup, 'statisticGroup')) {
    throw new TSArgsError('teamsnap.saveStatisticGroup', "`statisticGroup.type` must be 'statisticGroup'");
  }
  if (!statisticGroup.name) {
    return this.reject('You must specify a name', 'name', callback);
  }
  if (!statisticGroup.teamId) {
    return this.reject('You must specify a team', 'teamId', callback);
  }
  return this.saveItem(statisticGroup, callback);
};

exports.deleteStatisticGroup = function(statisticGroup, callback) {
  if (!statisticGroup) {
    throw new TSArgsError('teamsnap.deleteStatisticGroup', '`statisticGroup` must be provided');
  }
  return this.deleteItem(statisticGroup, callback);
};

exports.reorderStatisticGroups = function(teamId, statisticGroupIds, callback) {
  var params;
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.reorderStatisticGroups', '`teamId` must be provided');
  }
  if (!(statisticGroupIds && Array.isArray(statisticGroupIds))) {
    throw new TSArgsError('teamsnap.reorderStatisticGroups', 'You must provide an array of ordered Statistic Group IDs');
  }
  params = {
    teamId: teamId,
    sortedIds: statisticGroupIds
  };
  return this.collections.statisticGroups.exec('reorderStatisticGroups', params).callback(callback);
};

});

require.register("collections/statistics.coffee", function(exports, require, module) {
exports.loadStatistics = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadStatistics', 'must provide a teamId or query parameters');
  }
  return this.loadItems('statistic', params, callback);
};

exports.createStatistic = function(data) {
  return this.createItem(data, {
    type: 'statistic'
  });
};

exports.saveStatistic = function(statistic, callback) {
  if (!statistic) {
    throw new TSArgsError('teamsnap.saveStatistic', '`statistic` must be provided');
  }
  if (!this.isItem(statistic, 'statistic')) {
    throw new TSArgsError('teamsnap.saveStatistic', "`statistic.type` must be 'statistic'");
  }
  if (!statistic.name) {
    return this.reject('You must specify a name.', 'name', callback);
  }
  if (!statistic.acronym) {
    return this.reject('You must specify an acronym.', 'acronym', callback);
  }
  if (!statistic.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  return this.saveItem(statistic, callback);
};

exports.deleteStatistic = function(statistic, callback) {
  if (!statistic) {
    throw new TSArgsError('teamsnap.deleteStatistic', '`statistic` must be provided');
  }
  return this.deleteItem(statistic, callback);
};

exports.reorderStatistics = function(teamId, statisticIds, callback) {
  var params;
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.reorderStatistics', '`teamId` must be provided');
  }
  if (!(statisticIds && Array.isArray(statisticIds))) {
    throw new TSArgsError('teamsnap.reorderStatistics', 'You must provide an array of ordered Statistic IDs');
  }
  params = {
    teamId: teamId,
    sortedIds: statisticIds
  };
  return this.collections.statistics.exec('reorderStatistics', params).callback(callback);
};

});

require.register("collections/teamFees.coffee", function(exports, require, module) {
exports.loadTeamFees = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamFees', 'must provide a teamId or query parameters');
  }
  return this.loadItems('teamFee', params, callback);
};

exports.createTeamFee = function(data) {
  return this.createItem(data, {
    type: 'teamFee'
  });
};

exports.saveTeamFee = function(teamFee, callback) {
  if (!teamFee) {
    throw new TSArgsError('teamsnap.saveTeamFee', '`teamFee` must be provided');
  }
  if (!this.isItem(teamFee, 'teamFee')) {
    throw new TSArgsError('teamsnap.saveTeamFee', "`teamFee.type` must be 'teamFee'");
  }
  if (!teamFee.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!teamFee.description) {
    return this.reject('You must provide a team fee description.', 'description', callback);
  }
  if (!teamFee.amount) {
    return this.reject('You must provide a fee amount.', 'description', callback);
  }
  return this.saveItem(teamFee, callback);
};

exports.deleteTeamFee = function(teamFee, callback) {
  if (!teamFee) {
    throw new TSArgsError('teamsnap.deleteTeamFee', '`teamFee` must be provided');
  }
  return this.deleteItem(teamFee, callback);
};

});

require.register("collections/teamMedia.coffee", function(exports, require, module) {
exports.ROTATION_DIRECTIONS = {
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

exports.loadTeamMedia = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamMedia', 'must provide a teamId or query parameters');
  }
  return this.loadItems('teamMedium', params, callback);
};

exports.createTeamMedium = function(data) {
  return this.createItem(data, {
    type: 'teamMedium'
  });
};

exports.uploadTeamMedium = function(teamMedium, progressCallback, callback) {
  if (!teamMedium) {
    throw new TSArgsError('teamsnap.uploadTeamMedium', "`teamMedium` must be provided");
  }
  if (!this.isItem(teamMedium, 'teamMedium')) {
    throw new TSArgsError('teamsnap.uploadTeamMedium', "`type` must be 'teamMedium'");
  }
  if (!this.isId(teamMedium.teamId)) {
    throw new TSArgsError('teamsnap.uploadTeamMedium', 'must include `teamId`');
  }
  if (!this.isId(teamMedium.teamMediaGroupId)) {
    throw new TSArgsError('teamsnap.uploadTeamMedium', 'must include `teamMediaGroupId`');
  }
  if (!(teamMedium.file instanceof File)) {
    throw new TSArgsError('teamsnap.uploadTeamMedium', 'must include `file` as type File');
  }
  return this.collections.teamMedia.file('uploadTeamMedium', teamMedium, progressCallback).pop().callback(callback);
};

exports.deleteTeamMedium = function(teamMedium, callback) {
  if (!teamMedium) {
    throw new TSArgsError('teamsnap.deleteTeamMedium', '`teamMedium` must be provided');
  }
  return this.deleteItem(teamMedium, callback);
};

exports.saveTeamMedium = function(teamMedium, callback) {
  if (!teamMedium) {
    throw new TSArgsError('teamsnap.saveTeamMedium', "`teamMedium` must be provided");
  }
  if (!this.isItem(teamMedium, 'teamMedium')) {
    throw new TSArgsError('teamsnap.saveTeamMedium', "`type` must be 'teamMedium'");
  }
  if (!this.isId(teamMedium.teamId)) {
    throw new TSArgsError('teamsnap.saveTeamMedium', 'must include `teamId`');
  }
  if (!this.isId(teamMedium.memberId)) {
    throw new TSArgsError('teamsnap.saveTeamMedium', 'must include `memberId`');
  }
  if (!this.isId(teamMedium.teamMediaGroupId)) {
    throw new TSArgsError('teamsnap.saveTeamMedium', 'must include `teamMediaGroupId`');
  }
  return this.saveItem(teamMedium, callback);
};

exports.saveTeamVideoLink = function(teamMedium, callback) {
  if (!teamMedium) {
    throw new TSArgsError('teamsnap.createVideoLink', "`teamMedium` must be provided");
  }
  if (!this.isItem(teamMedium, 'teamMedium')) {
    throw new TSArgsError('teamsnap.createVideoLink', "`type` must be 'teamMedium'");
  }
  if (!this.isId(teamMedium.teamId)) {
    throw new TSArgsError('teamsnap.createVideoLink', 'must include `teamId`');
  }
  if (!this.isId(teamMedium.teamMediaGroupId)) {
    throw new TSArgsError('teamsnap.createVideoLink', 'must include `teamMediaGroupId`');
  }
  return this.collections.teamMedia.exec('createTeamVideoLink', teamMedium).pop().callback(callback);
};

exports.bulkDeleteTeamMedia = function(teamMediumIds, callback) {
  var params;
  if (!teamMediumIds) {
    throw new TSArgsError('teamsnap.bulkDeleteTeamMedia', "`teamMediumIds` must be provided");
  }
  params = {
    teamMediumIds: teamMediumIds
  };
  return this.collections.teamMedia.exec('bulkDeleteTeamMedia', params).callback(callback);
};

exports.assignMediaToGroup = function(teamMediumIds, teamMediaGroupId, callback) {
  var params;
  if (!teamMediumIds) {
    throw new TSArgsError('teamsnap.assignMediaToGroup', 'must provide teamMediumIds');
  }
  if (this.isItem(teamMediaGroupId, 'teamMediaGroup')) {
    teamMediaGroupId = teamMediaGroupId.id;
  }
  if (!(teamMediaGroupId && this.isId(teamMediaGroupId))) {
    throw new TSArgsError('teamsnap.assignMediaToGroup', 'must provide a teamMediaGroupId');
  }
  params = {
    teamMediumIds: teamMediumIds,
    teamMediaGroupId: teamMediaGroupId
  };
  return this.collections.teamMedia.exec('assignMediaToGroup', params).callback(callback);
};

exports.rotateTeamMediumImage = function(teamMediumId, rotateDirection, callback) {
  var params;
  if (this.isItem(teamMediumId, 'teamMedium')) {
    teamMediumId = teamMediumId.id;
  }
  if (!(teamMediumId && this.isId(teamMediumId))) {
    throw new TSArgsError('teamsnap.rotateTeamMediumImage', 'must provide a teamMediumId');
  }
  if (!rotateDirection) {
    throw new TSArgsError('teamsnap.rotateTeamMediumImage', 'must provide a rotateDirection');
  }
  params = {
    teamMediumId: teamMediumId,
    rotateDirection: rotateDirection
  };
  return this.collections.teamMedia.exec('rotateTeamMediumImage', params).pop().callback(callback);
};

exports.setMediumAsTeamPhoto = function(teamMediumId, callback) {
  var params;
  if (this.isItem(teamMediumId, 'teamMedium')) {
    teamMediumId = teamMediumId.id;
  }
  if (!(teamMediumId && this.isId(teamMediumId))) {
    throw new TSArgsError('teamsnap.setMediumAsTeamPhoto', 'must include a teamMediumId');
  }
  params = {
    teamMediumId: teamMediumId
  };
  return this.collections.teamMedia.exec('setMediumAsTeamPhoto', params).pop().callback(callback);
};

exports.setMediumAsMemberPhoto = function(teamMediumId, memberId, callback) {
  var params;
  if (this.isItem(teamMediumId, 'teamMedium')) {
    teamMediumId = teamMediumId.id;
  }
  if (this.isItem(memberId, 'member')) {
    memberId = memberId.id;
  }
  if (!(teamMediumId && this.isId(teamMediumId))) {
    throw new TSArgsError('teamsnap.setMediumAsMemberPhoto', 'must include a teamMediumId');
  }
  if (!(memberId && this.isId(memberId))) {
    throw new TSArgsError('teamsnap.setMediumAsMemberPhoto', 'must include a memberId');
  }
  params = {
    teamMediumId: teamMediumId,
    memberId: memberId
  };
  return this.collections.teamMedia.exec('setMediumAsMemberPhoto', params).pop().callback(callback);
};

exports.reorderTeamMedia = function(teamId, teamMediaIds, callback) {
  var params;
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.reorderTeamMedia', '`teamId` must be provided');
  }
  if (!(teamMediaIds && Array.isArray(teamMediaIds))) {
    throw new TSArgsError('teamsnap.reorderTeamMedia', 'You must provide an array of ordered Team Medium IDs');
  }
  params = {
    teamId: teamId,
    sortedIds: teamMediaIds
  };
  return this.collections.teamMedia.exec('reorderTeamMedia', params).callback(callback);
};

exports.facebookShareTeamMedium = function(teamMediumId, facebookPageId, isSuppressedFromFeed, caption, callback) {
  var params;
  if (typeof facebookPageId === 'boolean') {
    callback = caption;
    caption = isSuppressedFromFeed;
    isSuppressedFromFeed = facebookPageId;
    facebookPageId = null;
  }
  if (typeof caption === 'function') {
    callback = caption;
  }
  if (facebookPageId != null) {
    facebookPageId = parseInt(facebookPageId);
  }
  if (this.isItem(teamMediumId, 'teamMedium')) {
    teamMediumId = teamMediumId.id;
  }
  if (!((isSuppressedFromFeed != null) && typeof isSuppressedFromFeed === 'boolean')) {
    throw new TSArgsError('teamsnap.facebookShareMedium', 'must include boolean isSuppressedFromFeed');
  }
  params = {
    teamMediumId: teamMediumId,
    facebookPageId: facebookPageId,
    caption: caption,
    isSuppressedFromFeed: isSuppressedFromFeed
  };
  return this.collections.teamMedia.exec('facebookShareTeamMedium', params).pop().callback(callback);
};

});

require.register("collections/teamMediaGroups.coffee", function(exports, require, module) {
exports.loadTeamMediaGroups = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamMediaGroups', 'must provide a teamId or query parameters');
  }
  return this.loadItems('teamMediaGroup', params, callback);
};

exports.createTeamMediaGroup = function(data) {
  return this.createItem(data, {
    type: 'teamMediaGroup'
  });
};

exports.saveTeamMediaGroup = function(teamMediaGroup, callback) {
  if (!teamMediaGroup) {
    throw new TSArgsError('teamsnap.saveTeamMediaGroup', "`teamMediaGroup` must be provided");
  }
  if (!this.isItem(teamMediaGroup, 'teamMediaGroup')) {
    throw new TSArgsError('teamsnap.saveTeamMediaGroup', "`teamMediaGroup.type` must be 'teamMediaGroup'");
  }
  return this.saveItem(teamMediaGroup, callback);
};

exports.deleteTeamMediaGroup = function(teamMediaGroup, callback) {
  if (!teamMediaGroup) {
    throw new TSArgsError('teamsnap.deleteTeamMediaGroup', '`teamMediaGroup` must be provided');
  }
  return this.deleteItem(teamMediaGroup, callback);
};

exports.reorderTeamMediaGroups = function(teamId, teamMediaGroupIds, callback) {
  var params;
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.reorderTeamMediaGroups', '`teamId` must be provided');
  }
  if (!(teamMediaGroupIds && Array.isArray(teamMediaGroupIds))) {
    throw new TSArgsError('teamsnap.reorderTeamMediaGroups', 'You must provide an array of ordered Team Media Group IDs');
  }
  params = {
    teamId: teamId,
    sortedIds: teamMediaGroupIds
  };
  return this.collections.teamMediaGroups.exec('reorderTeamMediaGroups', params).callback(callback);
};

exports.facebookShareTeamMediaGroup = function(teamMediaGroupId, facebookPageId, isSuppressedFromFeed, albumName, callback) {
  var params;
  if (typeof facebookPageId === 'boolean') {
    callback = albumName;
    albumName = isSuppressedFromFeed;
    isSuppressedFromFeed = facebookPageId;
    facebookPageId = null;
  }
  if (typeof albumName === 'function') {
    callback = albumName;
  }
  if (facebookPageId != null) {
    facebookPageId = parseInt(facebookPageId);
  }
  if (this.isItem(teamMediaGroupId, 'teamMedium')) {
    teamMediaGroupId = teamMediaGroup.id;
  }
  if (!((isSuppressedFromFeed != null) && typeof isSuppressedFromFeed === 'boolean')) {
    throw new TSArgsError('teamsnap.facebookShareMediaGroup', 'must include boolean isSuppressedFromFeed');
  }
  params = {
    teamMediaGroupId: teamMediaGroupId,
    facebookPageId: facebookPageId,
    albumName: albumName,
    isSuppressedFromFeed: isSuppressedFromFeed
  };
  return this.collections.teamMediaGroups.exec('facebookShareTeamMediaGroup', params).pop().callback(callback);
};

});

require.register("collections/teamMediumComments.coffee", function(exports, require, module) {
exports.loadTeamMediumComments = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamMediumComments', 'must provide a teamId or query parameters');
  }
  return this.loadItems('teamMediumComment', params, callback);
};

exports.createTeamMediumComment = function(data) {
  return this.createItem(data, {
    type: 'teamMediumComment'
  });
};

exports.saveTeamMediumComment = function(teamMediumComment, callback) {
  if (!teamMediumComment) {
    throw new TSArgsError('teamsnap.saveTeamMediumComment', '`teamMediumComment` must be provided');
  }
  if (!this.isItem(teamMediumComment, 'teamMediumComment')) {
    throw new TSArgsError('teamsnap.saveTeamMediumComment', "`teamMediumComment.type` must be 'teamMediumComment'");
  }
  return this.saveItem(teamMediumComment, callback);
};

exports.deleteTeamMediumComment = function(teamMediumComment, callback) {
  if (!teamMediumComment) {
    throw new TSArgsError('teamsnap.deleteTeamMediumComment', '`teamMediumComment` must be provided');
  }
  return this.deleteItem(teamMediumComment, callback);
};

});

require.register("collections/teamPhotos.coffee", function(exports, require, module) {
exports.loadTeamPhotos = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamPhotos', 'must provide a `teamId` or query parameters');
  }
  return this.loadItems('teamPhoto', params, callback);
};

exports.loadTeamPhoto = function(params, callback) {
  if (this.isId(params)) {
    params = {
      id: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamPhoto', 'must provide an `id` or query parameters');
  }
  return this.loadItem('teamPhoto', params, callback);
};

});

require.register("collections/teamPublicSites.coffee", function(exports, require, module) {
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

require.register("collections/teamStatistics.coffee", function(exports, require, module) {
exports.loadTeamStatistics = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamStatistics', 'must provide a teamId or query parameters');
  }
  return this.loadItems('teamStatistic', params, callback);
};

});

require.register("collections/teams.coffee", function(exports, require, module) {
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
  var ref;
  if (!team) {
    throw new TSArgsError('teamsnap.saveTeam', "`team` must be provided");
  }
  if (!this.isItem(team, 'team')) {
    throw new TSArgsError('teamsnap.saveTeam', "`type` must be 'team'");
  }
  if (!((ref = team.name) != null ? ref.trim() : void 0)) {
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
  var key, loadParams, params, value;
  if (typeof teamId === 'object' && !Array.isArray(teamId)) {
    loadParams = teamId;
    teamId = loadParams.teamId;
    types = loadParams.types;
  }
  if (!(this.isId(teamId) || (Array.isArray(teamId) && this.isId(teamId[0])))) {
    throw new TSArgsError('teamsnap.bulkLoad', 'teamId must be provided');
    if (typeof types === 'function') {
      callback = types;
      types = null;
    }
  }
  if (!Array.isArray(types)) {
    types = this.getTeamTypes();
    types.splice(types.indexOf('availability'), 1);
  }
  params = {
    teamId: teamId,
    types: types.map(this.underscoreType).join(',')
  };
  if (loadParams != null) {
    if (loadParams.scopeTo != null) {
      params.scopeTo = this.underscoreType(loadParams.scopeTo);
    }
    for (key in loadParams) {
      value = loadParams[key];
      if (key.indexOf('__') !== -1) {
        params[key] = value;
      }
    }
  }
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

exports.updateTimeZone = function(options) {
  if (options == null) {
    options = {};
  }
  if (!options.timeZone) {
    throw new TSArgsError('teamsnap.updateTimeZone', 'options.timeZone is required.');
  }
  if (!options.teamId) {
    throw new TSArgsError('teamsnap.updateTimeZone', 'options.teamId is required.');
  }
  if (!options.offsetTeamTimes) {
    throw new TSArgsError('teamsnap.updateTimeZone', 'options.offsetTeamTimes is required');
  }
  return this.collections.teams.exec('updateTimeZone', options);
};

exports.resetStatistics = function(teamId, callback) {
  var params;
  if (!teamId) {
    throw new TSArgsError('teamsnap.resetStatistics', "`teamId` must be provided");
  }
  if (this.isItem(teamId, 'teamId')) {
    teamId = teamId.id;
  }
  if (!this.isId(teamId)) {
    throw new TSArgsError('teamsnap.resetStatistics', "`teamId` must be a valid id");
  }
  params = {
    teamId: teamId
  };
  return this.collections.teams.exec('resetStatistics', params).callback(callback);
};

exports.divisionLoadTeams = function(params, callback) {
  if (!params.divisionId) {
    throw new TSArgsError('teamsnap.divisionLoadTeams', "`divisionId` must be provided");
  }
  return this.collections.teams.queryItems('divisionSearch', params, callback);
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

require.register("collections/teamsPaypalPreferences.coffee", function(exports, require, module) {
exports.loadTeamsPaypalPreferences = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamsPaypalPreferences', 'must provide a teamId or query parameters');
  }
  return this.loadItems('teamPaypalPreferences', params, callback);
};

exports.loadTeamPaypalPreferences = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadTeamPaypalPreferences', 'must provide a teamId or query parameters');
  }
  return this.loadItem('teamPaypalPreferences', params, callback);
};

exports.saveTeamPaypalPreferences = function(teamPaypalPreferences, callback) {
  if (!teamPaypalPreferences) {
    throw new TSArgsError('teamsnap.saveTeamPaypalPreferences', "`teamPaypalPreferences` must be provided");
  }
  if (!this.isItem(teamPaypalPreferences, 'teamPaypalPreferences')) {
    throw new TSArgsError('teamsnap.saveTeamPaypalPreferences', "`teamPaypalPreferences.type` must be 'teamPaypalPreferences'");
  }
  return this.saveItem(teamPaypalPreferences, callback);
};

});

require.register("collections/teamsPreferences.coffee", function(exports, require, module) {
exports.ASSIGNMENTS_ENABLED_FOR_CODE = {
  GamesAndEvents: 0,
  Games: 1,
  Events: 2
};

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
    teamPreferencesId = teamPreferencesId.id;
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

require.register("collections/teamsResults.coffee", function(exports, require, module) {
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

require.register("collections/trackedItemStatuses.coffee", function(exports, require, module) {
var key, ref, statuses, value;

exports.TRACKING = {
  NONE: 0,
  CHECK: 1,
  X: 2
};

statuses = {};

ref = exports.TRACKING;
for (key in ref) {
  value = ref[key];
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

require.register("collections/trackedItems.coffee", function(exports, require, module) {
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
  var ref;
  if (!trackedItem) {
    throw new TSArgsError('teamsnap.saveTrackedItem', "`trackedItem` must be provided");
  }
  if (!this.isItem(trackedItem, 'trackedItem')) {
    throw new TSArgsError('teamsnap.saveTrackedItem', "`trackedItem.type` must be 'trackedItem'");
  }
  if (!trackedItem.teamId) {
    return this.reject('You must choose a team.', 'teamId', callback);
  }
  if (!((ref = trackedItem.name) != null ? ref.trim() : void 0)) {
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

require.register("collections/users.coffee", function(exports, require, module) {
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
  return this.collections.root.queryItem('me', callback);
};

exports.saveUser = function(user, callback) {
  var ref;
  if (!user) {
    throw new TSArgsError('teamsnap.saveUser', "`user` must be provided");
  }
  if (!this.isItem(user, 'user')) {
    throw new TSArgsError('teamsnap.saveUser', "`user.type` must be 'user'");
  }
  if (!((ref = user.email) != null ? ref.trim() : void 0)) {
    return this.reject('You must provide an email for the user.', 'email', callback);
  }
  return this.saveItem(user, callback);
};

});

require.register("errors.coffee", function(exports, require, module) {
var TSArgsError, TSError, TSServerError, TSValidationError,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TSError = (function(superClass) {
  extend(TSError, superClass);

  function TSError(message) {
    TSError.__super__.constructor.call(this);
    this.name = 'TeamSnapError';
    this.message = message;
  }

  return TSError;

})(Error);

TSArgsError = (function(superClass) {
  extend(TSArgsError, superClass);

  function TSArgsError(method, msg) {
    TSArgsError.__super__.constructor.call(this);
    this.name = 'TeamSnapArgumentError';
    this.message = "Failed to execute `" + method + "`: " + msg + ".";
  }

  return TSArgsError;

})(TypeError);

TSValidationError = (function(superClass) {
  extend(TSValidationError, superClass);

  function TSValidationError(message, field) {
    TSValidationError.__super__.constructor.call(this);
    this.name = 'TeamSnapValidationError';
    this.message = message;
    this.field = field;
  }

  return TSValidationError;

})(RangeError);

TSServerError = (function(superClass) {
  extend(TSServerError, superClass);

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

require.register("linking.coffee", function(exports, require, module) {
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

require.register("loadCollections.coffee", function(exports, require, module) {
var Collection, collectionsPromise, promises, types,
  hasProp = {}.hasOwnProperty;

promises = require('./promises');

types = require('./types');

Collection = require('./model').Collection;

collectionsPromise = null;

module.exports = function(request, cachedCollections) {
  if (!collectionsPromise || collectionsPromise.getStatus() === 'reject') {
    collectionsPromise = request.get(teamsnap.apiUrl).then(function(xhr) {
      var collections, key, loads, ref, ref1, ref2, ref3, root, rootTypeToRels, value;
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
        rootTypeToRels = {};
        loads = [];
        ref = collections.root.links;
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          value = ref[key];
          rootTypeToRels[value.href] = key;
        }
        if ((ref1 = collections.root) != null ? (ref2 = ref1.links) != null ? (ref3 = ref2.schemas) != null ? ref3.href : void 0 : void 0 : void 0) {
          loads.push(request.get(collections.root.links.schemas.href).then(function(xhr) {
            return xhr.data.forEach(function(collection) {
              var rel;
              rel = rootTypeToRels[collection.collection.href];
              if (rel && rel !== "root") {
                return collections[rel] = Collection.fromData(collection);
              }
            });
          }));
        } else {
          types.getTypes().forEach(function(type) {
            var rel;
            rel = types.getPluralType(type);
            if (root.links.has(rel)) {
              return loads.push(request.get(root.links.href(rel)).then(function(xhr) {
                return collections[rel] = Collection.fromData(xhr.data);
              }));
            }
          });
        }
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

require.register("model.coffee", function(exports, require, module) {
var Collection, File, Item, MetaList, ScopedCollection, camelize, copy, dateField, dateValue, promises, underscore,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
    var ref, ref1;
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
    this.template = ((ref = data.template) != null ? ref.data : void 0) || [];
    if ((ref1 = data.items) != null ? ref1.length : void 0) {
      this.items = data.items;
    }
    return this;
  };

  return Collection;

})();

ScopedCollection = (function(superClass) {
  extend(ScopedCollection, superClass);

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
        var all, items, ref, ref1;
        if ((items = (ref = xhr.data) != null ? (ref1 = ref.collection) != null ? ref1.items : void 0 : void 0)) {
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

  ScopedCollection.prototype.file = function(commandName, params, progress, callback) {
    return this.commands.fileExec(this._request, commandName, params, progress, callback);
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
    var i, len, prop, ref, ref1, value;
    if (data != null ? data.collection : void 0) {
      data = (ref = data.collection.items) != null ? ref[0] : void 0;
    }
    if (!data) {
      return;
    }
    this.href = data.href;
    this.links.deserialize(data.links);
    ref1 = data.data;
    for (i = 0, len = ref1.length; i < len; i++) {
      prop = ref1[i];
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
        if (!hasProp.call(params, key)) continue;
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
    var entry, i, j, len, len1, link, linksToRemove, param, params, propName, ref, results;
    if (!Array.isArray(data)) {
      return;
    }
    linksToRemove = {};
    Object.keys(this).forEach(function(link) {
      return linksToRemove[link] = true;
    });
    for (i = 0, len = data.length; i < len; i++) {
      entry = data[i];
      params = {};
      if (Array.isArray(entry.data)) {
        ref = entry.data;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          param = ref[j];
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
    results = [];
    for (link in linksToRemove) {
      results.push(delete this[link]);
    }
    return results;
  };

  MetaList.prototype.has = function(rel) {
    return this.hasOwnProperty(rel);
  };

  MetaList.prototype.href = function(rel) {
    var ref;
    return (ref = this[rel]) != null ? ref.href : void 0;
  };

  MetaList.prototype.each = function(iterator) {
    var entry, ref, rel, results;
    ref = this;
    results = [];
    for (rel in ref) {
      if (!hasProp.call(ref, rel)) continue;
      entry = ref[rel];
      results.push(iterator(rel, entry.href, entry.params));
    }
    return results;
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

  MetaList.prototype.fileExec = function(request, rel, params, progress, callback) {
    var progressHook;
    if (typeof params === 'function') {
      callback = progress;
      progress = params;
      params = void 0;
    }
    progressHook = function(xhr, data) {
      if (data instanceof FormData) {
        return xhr.upload.onprogress = function(e) {
          if (e.lengthComputable) {
            return progress({
              loaded: e.loaded,
              total: e.total
            });
          }
        };
      }
    };
    request.hook(progressHook);
    return this._request(request, 'post', rel, params, 'items').callback(callback);
  };

  MetaList.prototype.cloneEmpty = function() {
    var clone, entry, ref, rel;
    clone = new MetaList();
    ref = this;
    for (rel in ref) {
      if (!hasProp.call(ref, rel)) continue;
      entry = ref[rel];
      if (entry.href) {
        clone[rel] = {
          href: ''
        };
      }
    }
    return clone;
  };

  MetaList.prototype._request = function(request, method, rel, params, type) {
    var data, entry, filteredOn, itemCollection, key, value;
    if (!(entry = this[rel])) {
      throw new TSError("Unable to find rel '" + rel + "'");
    }
    if (params) {
      data = {};
      for (key in params) {
        if (!hasProp.call(params, key)) continue;
        value = params[key];
        if (value instanceof File) {
          data = new FormData();
          for (key in params) {
            if (!hasProp.call(params, key)) continue;
            value = params[key];
            data.append(underscore(key), value);
          }
          break;
        }
        if (entry.params.hasOwnProperty(key)) {
          data[underscore(key)] = value;
        } else if (key.indexOf('__') !== -1) {
          filteredOn = key.split('__');
          itemCollection = teamsnap.getCollectionForItem(filteredOn[0]);
          if (itemCollection.queries.search.params.hasOwnProperty(filteredOn[1])) {
            data[underscore(key)] = value;
          }
        }
      }
    }
    return request(method, entry.href, data).then(function(xhr) {
      var items, ref, ref1;
      items = ((ref = xhr.data) != null ? (ref1 = ref.collection) != null ? ref1.items : void 0 : void 0) ? Item.fromArray(request, xhr.data.collection.items) : [];
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

require.register("persistence.coffee", function(exports, require, module) {
var Item, MetaList, ScopedCollection, camelize, copy, linking, lookup, modifyModel, modifySDK, promises, ref, revertModel, revertSDK, revertWrapMethod, types, wrapMethod, wrapSave,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

promises = require('./promises');

linking = require('./linking');

types = require('./types');

Item = require('./model').Item;

ref = require('./model'), ScopedCollection = ref.ScopedCollection, Item = ref.Item, MetaList = ref.MetaList;

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
  var i, items, len, plural, ref1, ref2, teamType, users, value;
  items = [team];
  users = (ref1 = team.members) != null ? ref1.filter(function(member) {
    return member.user;
  }).map(function(member) {
    return member.user;
  }) : void 0;
  ref2 = this.getTeamTypes();
  for (i = 0, len = ref2.length; i < len; i++) {
    teamType = ref2[i];
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
      var item, ref1;
      if (data != null ? data.collection : void 0) {
        data = (ref1 = data.collection.items) != null ? ref1[0] : void 0;
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
          if (field.name === 'type') {
            value = camelize(value);
          }
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
    }), sdk.loadLeagueCustomData({
      memberId: member.id
    }), sdk.loadMemberPayments({
      memberId: member.id
    }), sdk.loadMemberBalances({
      memberId: member.id
    }), sdk.loadTeamFees({
      teamId: member.teamId
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
      toRemove.push.apply(toRemove, member.memberPayments);
      toRemove.push.apply(toRemove, member.memberStatistics);
      toRemove.push.apply(toRemove, member.statisticData);
      toRemove.push.apply(toRemove, member.memberAssignments);
      linking.unlinkItems(toRemove, lookup);
      return deleteMember.call(this, member, callback).then(function(result) {
        sdk.loadTeamFees(member.teamId);
        sdk.loadStatisticAggregates(member.teamId);
        return result;
      }).fail(function(err) {
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
      return deleteContact.call(this, contact, callback).then(function(result) {
        return sdk.loadMembers({
          memberId: contact.memberId
        }).then(function() {
          return result;
        });
      }).fail(function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveMemberEmailAddress', function(saveMemberEmailAddress) {
    return function(emailAddress, callback) {
      return saveMemberEmailAddress.call(this, emailAddress, callback).then(function(result) {
        return sdk.loadMembers({
          id: emailAddress.memberId
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'deleteMemberEmailAddress', function(deleteMemberEmailAddress) {
    return function(emailAddress, callback) {
      return deleteMemberEmailAddress.call(this, emailAddress, callback).then(function(result) {
        return sdk.loadMembers({
          id: emailAddress.memberId
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveMemberPhoneNumber', function(saveMemberPhoneNumber) {
    return function(phoneNumber, callback) {
      return saveMemberPhoneNumber.call(this, phoneNumber, callback).then(function(result) {
        return sdk.loadMembers({
          id: phoneNumber.memberId
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'deleteMemberPhoneNumber', function(deleteMemberPhoneNumber) {
    return function(phoneNumber, callback) {
      return deleteMemberPhoneNumber.call(this, phoneNumber, callback).then(function(result) {
        return sdk.loadMembers({
          id: phoneNumber.memberId
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveContactEmailAddress', function(saveContactEmailAddress) {
    return function(emailAddress, callback) {
      return saveContactEmailAddress.call(this, emailAddress, callback).then(function(result) {
        return sdk.loadMembers({
          id: emailAddress.memberId
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'deleteContactEmailAddress', function(deleteContactEmailAddress) {
    return function(emailAddress, callback) {
      return deleteContactEmailAddress.call(this, emailAddress, callback).then(function(result) {
        return sdk.loadMembers({
          id: emailAddress.memberId
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveContactPhoneNumber', function(saveContactPhoneNumber) {
    return function(phoneNumber, callback) {
      return saveContactPhoneNumber.call(this, phoneNumber, callback).then(function(result) {
        return sdk.loadMembers({
          id: phoneNumber.memberId
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'deleteContactPhoneNumber', function(deleteContactPhoneNumber) {
    return function(phoneNumber, callback) {
      return deleteContactPhoneNumber.call(this, phoneNumber, callback).then(function(result) {
        return sdk.loadMembers({
          id: phoneNumber.memberId
        }).then(function() {
          return result;
        });
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
    var e, firstEvent, ref1, ref2, repeatingEventIds, toRemove;
    if (event.isGame) {
      return promises.when(sdk.loadTeamResults(event.teamId), sdk.loadOpponentResults(event.opponentId), sdk.loadEventStatistics({
        eventId: event.id
      }));
    } else if (Array.isArray(event)) {
      repeatingEventIds = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = event.length; i < len; i++) {
          e = event[i];
          results.push(e.id);
        }
        return results;
      })();
      firstEvent = event.shift();
      toRemove = [];
      if ((ref1 = firstEvent.team) != null) {
        if ((ref2 = ref1.events) != null) {
          ref2.forEach(function(e) {
            if (e.repeatingUuid === firstEvent.repeatingUuid) {
              return toRemove.push(e);
            }
          });
        }
      }
      toRemove = toRemove.filter(function(e) {
        var ref3;
        return ref3 = e.id, indexOf.call(repeatingEventIds, ref3) < 0;
      });
      return linking.unlinkItems(toRemove, lookup);
    }
  });
  wrapMethod(sdk, 'deleteEvent', function(deleteEvent) {
    return function(event, include, notify, notifyAs, callback) {
      var events, ref1, ref2, startDate, toRemove, uuid;
      events = [];
      if (typeof include === 'string' && include !== sdk.EVENTS.NONE) {
        uuid = event.repeatingUuid;
        startDate = event.startDate;
        if ((ref1 = event.team) != null) {
          if ((ref2 = ref1.events) != null) {
            ref2.forEach(function(event) {
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
        toRemove.push.apply(toRemove, event.availabilities);
        return toRemove.push.apply(toRemove, event.eventStatistics);
      });
      event.assignments.forEach(function(assignment) {
        if (assignment.memberAssignments.length) {
          return assignment.memberAssignments.forEach(function(memberAssignment) {
            return toRemove.push.apply(toRemove, memberAssignment);
          });
        }
      });
      linking.unlinkItems(toRemove, lookup);
      return deleteEvent.call(this, event, include, notify, notifyAs, callback).then(function(result) {
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
  wrapMethod(sdk, 'deleteStatistic', function(deleteStatistic) {
    return function(statistic, callback) {
      var toRemove;
      toRemove = statistic.statisticData.slice();
      toRemove.push.apply(toRemove, statistic.eventStatistics);
      toRemove.push.apply(toRemove, statistic.memberStatistics);
      toRemove.push.apply(toRemove, statistic.teamStatistics);
      toRemove.push.apply(toRemove, statistic.statisticAggregates);
      linking.unlinkItems(toRemove, lookup);
      return deleteStatistic.call(this, statistic).then(function(result) {
        var bulkLoadTypes, statisticId, teamId;
        teamId = statistic.teamId;
        statisticId = result.id;
        bulkLoadTypes = ['memberStatistic', 'teamStatistic', 'statisticAggregate', 'eventStatistic'];
        return sdk.bulkLoad(teamId, bulkLoadTypes).then(function() {
          return result;
        });
      }).fail(function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveStatistic', function(saveStatistic) {
    return function(statistic, callback) {
      if ((statistic.statisticGroupId == null) && (statistic.statisticGroup != null)) {
        linking.unlinkItems(statistic.statisticGroup, statistic);
      }
      return saveStatistic.call(this, statistic, callback).then(function(result) {
        var bulkLoadTypes, statisticId, teamId;
        teamId = statistic.teamId;
        statisticId = result.id;
        bulkLoadTypes = ['memberStatistic', 'teamStatistic', 'statisticAggregate', 'statistic', 'statisticGroup', 'eventStatistic'];
        return sdk.bulkLoad(teamId, bulkLoadTypes).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'bulkSaveStatisticData', function(bulkSaveStatisticData) {
    return function(templates, callback) {
      return bulkSaveStatisticData.call(this, templates, callback).then(function(result) {
        var bulkLoadTypes, teamId;
        if ((result[0] != null) && (result[0].teamId != null)) {
          teamId = result[0].teamId;
          bulkLoadTypes = ['memberStatistic', 'statisticAggregate', 'eventStatistic'];
          return sdk.bulkLoad(teamId, bulkLoadTypes).then(function() {
            return result;
          });
        }
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveStatisticDatum', function(saveStatisticDatum) {
    return function(statisticDatum, callback) {
      return saveStatisticDatum.call(this, statisticDatum, callback).then(function(result) {
        var bulkLoadTypes, statisticId, teamId;
        teamId = result.teamId;
        statisticId = result.statisticId;
        bulkLoadTypes = ['memberStatistic', 'statisticAggregate', 'eventStatistic'];
        return sdk.bulkLoad(teamId, bulkLoadTypes).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'bulkDeleteStatisticData', function(bulkDeleteStatisticData) {
    return function(member, event, callback) {
      var ref1, toRemove;
      toRemove = [];
      toRemove.push(event.eventStatistics);
      if ((ref1 = member.statisticData) != null) {
        ref1.forEach(function(statisticDatum) {
          if (statisticDatum.event === event) {
            return toRemove.push(statisticDatum);
          }
        });
      }
      linking.unlinkItems(toRemove, lookup);
      return bulkDeleteStatisticData.call(this, member, event).then(function(result) {
        var bulkLoadTypes, teamId;
        teamId = member.teamId;
        bulkLoadTypes = ['memberStatistic', 'statisticAggregate', 'eventStatistic'];
        return sdk.bulkLoad(teamId, bulkLoadTypes).then(function() {
          return result;
        });
      }).fail(function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveMemberPayment', function(saveMemberPayment) {
    return function(memberPayment, callback) {
      return saveMemberPayment.call(this, memberPayment).then(function(result) {
        var memberId, teamFeeId;
        memberId = result.memberId;
        teamFeeId = result.teamFeeId;
        return promises.when(sdk.loadMemberBalances({
          memberId: memberId
        }), sdk.loadTeamFees({
          id: teamFeeId
        }), sdk.loadPaymentNotes({
          memberPaymentId: memberPayment.id
        })).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveTeamFee', function(saveTeamFee) {
    return function(teamFee, callback) {
      return saveTeamFee.call(this, teamFee).then(function(result) {
        var teamId;
        teamId = result.teamId;
        return sdk.loadMemberBalances({
          teamId: teamId
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'deleteTeamFee', function(deleteTeamFee) {
    return function(teamFee, callback) {
      return deleteTeamFee.call(this, teamFee).then(function(result) {
        var teamId;
        teamId = teamFee.teamId;
        return sdk.loadMemberBalances({
          teamId: teamId
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'assignMediaToGroup', function(assignMediaToGroup) {
    return function(teamMediumIds, teamMediaGroup, callback) {
      return assignMediaToGroup.call(this, teamMediumIds, teamMediaGroup).then(function(result) {
        var bulkLoadTypes, teamId;
        teamId = result[0].teamId;
        bulkLoadTypes = ['teamMediaGroup', 'teamMedium'];
        return sdk.bulkLoad(teamId, bulkLoadTypes).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'setMediumAsTeamPhoto', function(setMediumAsTeamPhoto) {
    return function(teamMedium, callback) {
      return setMediumAsTeamPhoto.call(this, teamMedium).then(function(result) {
        var teamId;
        teamId = result.teamId;
        return sdk.loadTeamPreferences(teamId).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'setMediumAsMemberPhoto', function(setMediumAsMemberPhoto) {
    return function(teamMedium, member, callback) {
      return setMediumAsMemberPhoto.call(this, teamMedium, member).then(function(result) {
        if (member.id != null) {
          return sdk.loadMembers({
            id: member.id
          }).then(function() {
            return result;
          });
        }
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'uploadTeamMedium', function(uploadTeamMedium) {
    return function(teamMedium, progressCallback, callback) {
      return uploadTeamMedium.call(this, teamMedium, progressCallback).then(function(result) {
        return promises.when(sdk.loadTeam(teamMedium.teamId), sdk.loadTeamMediaGroups({
          id: teamMedium.teamMediaGroupId
        })).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveTeamMedium', function(saveTeamMedium) {
    return function(teamMedium, callback) {
      var ref1, teamMediaGroupIds;
      teamMediaGroupIds = [teamMedium.teamMediaGroupId];
      if ((((ref1 = teamMedium._state) != null ? ref1.teamMediaGroupId : void 0) != null) !== teamMedium.teamMediaGroupId) {
        teamMediaGroupIds.push(teamMedium._state.teamMediaGroupId);
      }
      return saveTeamMedium.call(this, teamMedium).then(function(result) {
        var teamId;
        teamId = teamMedium.teamId;
        return sdk.loadTeamMediaGroups({
          id: teamMediaGroupIds
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveTeamVideoLink', function(saveTeamVideoLink) {
    return function(teamMedium, callback) {
      return saveTeamVideoLink.call(this, teamMedium).then(function(result) {
        return sdk.loadTeamMediaGroups({
          id: teamMedium.teamMediaGroupId
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'deleteTeamMedium', function(deleteTeamMedium) {
    return function(teamMedium, callback) {
      var toRemove;
      toRemove = teamMedium.teamMediumComments.slice();
      linking.unlinkItems(toRemove, lookup);
      return deleteTeamMedium.call(this, teamMedium).then(function(result) {
        return promises.when(sdk.loadTeam(teamMedium.teamId), sdk.loadTeamMediaGroups({
          id: teamMedium.teamMediaGroupId
        })).then(function() {
          return result;
        });
      }, function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'bulkDeleteTeamMedia', function(bulkDeleteTeamMedia) {
    return function(teamMediumIds, teamId, callback) {
      if (typeof teamId === 'function') {
        callback = teamId;
      }
      return bulkDeleteTeamMedia.call(this, teamMediumIds, callback).then(function(result) {
        if (typeof teamId === 'string' || typeof teamId === 'number') {
          return promises.when(sdk.loadTeam(teamId), sdk.loadTeamMediaGroups({
            teamId: teamId
          })).then(function() {
            return result;
          });
        } else {
          return result;
        }
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'reorderTeamMedia', function(reorderTeamMedia) {
    return function(teamId, teamMediaIds, teamMediaGroupId, callback) {
      var params;
      params = {
        teamId: teamId
      };
      if (typeof teamMediaGroupId === 'function') {
        callback = teamMediaGroupId;
      }
      if (typeof teamMediaGroupId === 'string' || typeof teamMediaGroupId === 'number') {
        params = {
          id: teamMediaGroupId
        };
      }
      return reorderTeamMedia.call(this, teamId, teamMediaIds).then(function(result) {
        return sdk.loadTeamMediaGroups(params).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'deleteTeam', function(deleteTeam) {
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
  wrapMethod(sdk, 'deleteForumTopic', function(deleteForumTopic) {
    return function(topic, callback) {
      var toRemove;
      toRemove = [];
      toRemove.push.apply(toRemove, topic.forumPosts);
      linking.unlinkItems(toRemove, lookup);
      return deleteForumTopic.call(this, topic, callback).fail(function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'invite', function(invite) {
    return function(options, callback) {
      return invite.call(this, options).then(function(result) {
        var contactId, memberId;
        if (options.hasOwnProperty('memberId')) {
          memberId = options.memberId;
          return sdk.loadMemberEmailAddresses({
            memberId: memberId
          }).then(function() {
            return result;
          });
        } else if (options.hasOwnProperty('contactId')) {
          contactId = options.contactId;
          return sdk.loadContactEmailAddresses({
            contactId: contactId
          }).then(function() {
            return result;
          });
        }
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'memberPaymentTransaction', function(memberPaymentTransaction) {
    return function(memberPaymentId, amount, note, callback) {
      return memberPaymentTransaction.call(this, memberPaymentId, amount, note).then(function(result) {
        var memberId, teamFeeId;
        memberId = result.memberId;
        teamFeeId = result.teamFeeId;
        return promises.when(sdk.loadMemberBalances({
          memberId: memberId
        }), sdk.loadTeamFees({
          id: teamFeeId
        }), sdk.loadPaymentNotes({
          memberPaymentId: memberPaymentId
        })).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'importMembersFromTeam', function(importMembersFromTeam) {
    return function(memberIds, teamId, callback) {
      return importMembersFromTeam.call(this, memberIds, teamId).then(function(result) {
        memberIds = result.map(function(member) {
          return member.id;
        });
        return promises.when(sdk.loadMembers({
          id: memberIds
        }), sdk.loadContacts({
          memberId: memberIds
        }), sdk.loadMemberEmailAddresses({
          memberId: memberIds
        }), sdk.loadContactEmailAddresses({
          memberId: memberIds
        }), sdk.loadMemberPhoneNumbers({
          memberId: memberIds
        }), sdk.loadContactPhoneNumbers({
          memberId: memberIds
        })).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveBroadcastAlert', function(saveBroadcastAlert) {
    return function(broadcastAlert, callback) {
      return saveBroadcastAlert.call(this, broadcastAlert).then(function(result) {
        var params;
        if ((result.member != null) || (result.divisionMember != null)) {
          params = {
            memberId: result.memberId
          };
        } else {
          params = {
            contactId: result.contactId
          };
        }
        sdk.loadMessageData(params);
        return sdk.loadMessages({
          messageSourceId: result.id
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveBroadcastEmail', function(saveBroadcastEmail) {
    return function(broadcastEmail, callback) {
      return saveBroadcastEmail.call(this, broadcastEmail).then(function(result) {
        var params;
        if ((result.member != null) || (result.divisionMember != null)) {
          params = {
            memberId: result.memberId
          };
        } else {
          params = {
            contactId: result.contactId
          };
        }
        sdk.loadMessageData(params);
        return sdk.loadMessages({
          messageSourceId: result.id
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveAssignment', function(saveAssignment) {
    return function(assignment, callback) {
      return saveAssignment.call(this, assignment, callback).then(function(result) {
        return sdk.loadMemberAssignments({
          assignmentId: result.id
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'deleteAssignment', function(deleteAssignment) {
    return function(assignment, callback) {
      var toRemove;
      if (assignment.memberAssignments.length) {
        toRemove = assignment.memberAssignments;
        linking.unlinkItems(toRemove, lookup);
      }
      return deleteAssignment.call(this, assignment).then(function(result) {
        return sdk.loadEvents({
          eventId: assignment.eventId
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveMemberAssignment', function(saveMemberAssignment) {
    return function(memberAssignment, callback) {
      return saveMemberAssignment.call(this, memberAssignment).then(function(result) {
        return sdk.loadAssignments({
          id: result.assignmentId
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'deleteMemberAssignment', function(deleteMemberAssignment) {
    return function(memberAssignment, callback) {
      return deleteMemberAssignment.call(this, memberAssignment, callback).then(function(result) {
        return sdk.loadAssignments({
          id: memberAssignment.assignmentId
        }).then(function(assignment) {
          assignment[0].member = null;
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'markMessageAsRead', function(markMessageAsRead) {
    return function(messageId, callback) {
      return markMessageAsRead.call(this, messageId, callback).then(function(result) {
        var params;
        if ((result.member != null) || (result.divisionMember != null)) {
          params = {
            memberId: result.memberId
          };
        } else {
          params = {
            contactId: result.contactId
          };
        }
        params.messageType = 'alert,email';
        sdk.loadMessages({
          id: result.messageId
        });
        return sdk.loadMessageData(params);
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'bulkDeleteMessages', function(bulkDeleteMessages) {
    return function(messages, callback) {
      var contactId, memberId, teamId, toRemove;
      if (Array.isArray(messages) && messages.length && this.isItem(messages[0], 'message')) {
        toRemove = messages;
      } else if (typeof messages === 'object' && this.isItem(messages, 'message')) {
        toRemove = [messages];
      }
      if (toRemove != null) {
        if (toRemove[0].contactId != null) {
          contactId = toRemove[0].contactId;
        } else if (toRemove[0].memberId != null) {
          memberId = toRemove[0].memberId;
        }
        teamId = toRemove[0].teamId;
        linking.unlinkItems(toRemove, lookup);
      }
      return bulkDeleteMessages.call(this, messages).then(function(result) {
        var params;
        if (toRemove != null) {
          params = {};
          if (contactId != null) {
            params.contactId = contactId;
          } else if (memberId != null) {
            params.memberId = memberId;
          }
          params.messageType = 'alert,email';
          params.teamId = teamId;
          return sdk.loadMessageData(params).then(function(result) {
            return result;
          }).fail(function(err) {
            return err;
          });
        } else {
          return result;
        }
      }).fail(function(err) {
        if (toRemove != null) {
          linking.linkItems(toRemove, lookup);
        }
        return err;
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'createBulkAssignments', function(createBulkAssignments) {
    return function(eventSet, description, teamId, createAsMemberId, callback) {
      return createBulkAssignments.call(this, eventSet, description, teamId, createAsMemberId, callback).then(function(result) {
        var assignmentIds;
        assignmentIds = result.map(function(assignment) {
          return assignment.id;
        });
        return sdk.loadAssignments({
          id: assignmentIds
        }).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  return wrapMethod(sdk, 'bulkDeleteMembers', function(bulkDeleteMembers) {
    return function(members, callback) {
      var toRemove;
      toRemove = [];
      members.forEach(function(member) {
        toRemove.push.apply(toRemove, member.assignments);
        toRemove.push.apply(toRemove, member.availabilities);
        member.contacts.forEach(function(contact) {
          toRemove.push.apply(toRemove, contact.contactEmailAddresses);
          toRemove.push.apply(toRemove, contact.contactPhoneNumbers);
          return toRemove.push(contact);
        });
        toRemove.push.apply(toRemove, member.trackedItemStatuses);
        toRemove.push.apply(toRemove, member.memberPayments);
        toRemove.push.apply(toRemove, member.memberStatistics);
        toRemove.push.apply(toRemove, member.statisticData);
        return toRemove.push.apply(toRemove, member.memberAssignments);
      });
      linking.unlinkItems(toRemove, lookup);
      return bulkDeleteMembers.call(this, members, callback).then(function(result) {
        return result;
      }).fail(function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
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

require.register("promises.coffee", function(exports, require, module) {
var Deferred, Promise, args, promises,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice,
  hasProp = {}.hasOwnProperty;

promises = typeof exports !== 'undefined' ? exports : this;

Promise = (function() {
  function Promise() {
    this.call = bind(this.call, this);
  }

  Promise.prototype.then = function(resolvedHandler, rejectedHandler, progressHandler, cancelHandler) {
    throw new TypeError('The Promise base class is abstract, this function is overwritten by the promise\'s deferred object');
  };

  Promise.prototype.callback = function(callback) {
    if (callback && typeof callback === 'function') {
      this.then(function() {
        var results;
        results = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return callback.apply(null, [null].concat(slice.call(results)));
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
    functionName = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this.then(function(object) {
      if (object != null) {
        object[functionName].apply(object, params);
      }
      return object;
    });
  };

  Promise.prototype.call = function() {
    var functionName, params;
    functionName = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this.then(function(object) {
      return object[functionName].apply(object, params);
    });
  };

  return Promise;

})();

['pop', 'shift', 'splice', 'filter', 'every', 'map', 'some'].forEach(function(method) {
  return Promise.prototype[method] = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return this.then(function(object) {
      return object != null ? typeof object[method] === "function" ? object[method].apply(object, args) : void 0 : void 0;
    });
  };
});

['push', 'reverse', 'sort', 'unshift', 'forEach'].forEach(function(method) {
  return Promise.prototype[method] = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
      if (!hasProp.call(methods, name)) continue;
      value = methods[name];
      SubPromise.prototype[name] = value;
    }
  }
  return SubPromise;
};

promises.when = function() {
  var alwaysCallback, count, createCallback, deferred, i, len, name, obj, params, rejected, rejectedCallback, resolvedCallback;
  params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
      results = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
  for (name = i = 0, len = params.length; i < len; name = ++i) {
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
  params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  params.isArgs = true;
  return params;
};

Deferred = (function() {
  function Deferred(promise) {
    if (promise == null) {
      promise = new promises.Promise;
    }
    this.progress = bind(this.progress, this);
    this.cancel = bind(this.cancel, this);
    this.reject = bind(this.reject, this);
    this.resolve = bind(this.resolve, this);
    this.finished = bind(this.finished, this);
    this.then = bind(this.then, this);
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
    var deferred, handler, i, len, method, nextDeferred, nextResult;
    for (i = 0, len = arguments.length; i < len; i++) {
      handler = arguments[i];
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
    var deferred, handler, method, nextResult, ref, results;
    results = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (this.status !== 'pending') {
      return;
    }
    if ((ref = results[0]) != null ? ref.isArgs : void 0) {
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
    var deferred, handler, method, nextResult, ref, results;
    results = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (this.status !== 'pending') {
      return;
    }
    if ((ref = results[0]) != null ? ref.isArgs : void 0) {
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
    var deferred, handler, method, nextResult, ref, ref1, results;
    results = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (this.status !== 'pending') {
      return;
    }
    if ((ref = results[0]) != null ? ref.isArgs : void 0) {
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
    if ((ref1 = this.promise.prev) != null) {
      ref1.cancel();
    }
  };

  Deferred.prototype.progress = function() {
    var i, len, params, progress, ref, results1;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = this.progressHandlers;
    results1 = [];
    for (i = 0, len = ref.length; i < len; i++) {
      progress = ref[i];
      results1.push(progress.apply(null, params));
    }
    return results1;
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
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    promise = PromiseClass ? new PromiseClass() : void 0;
    deferred = promises.defer(promise);
    if (typeof args[args.length - 1] === 'function') {
      callback = args.pop();
    }
    args.push(function(err, result) {
      var extras;
      extras = Array.prototype.slice.call(arguments, 2);
      if (callback) {
        callback.apply(null, [err, result].concat(slice.call(extras)));
      }
      if (err) {
        return deferred.reject(err);
      } else {
        return deferred.resolve.apply(deferred, [result].concat(slice.call(extras)));
      }
    });
    method.apply(this, args);
    return deferred.promise;
  };
};

promises.resolve = function() {
  var args, deferred;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  deferred = promises.defer();
  deferred.resolve.apply(deferred, args);
  return deferred.promise;
};

promises.reject = function() {
  var args, deferred;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  deferred = promises.defer();
  deferred.reject.apply(deferred, args);
  return deferred.promise;
};

});

require.register("request.coffee", function(exports, require, module) {
var FormData, RequestError, createRequest, promises, sendRequest, unloading,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

if (typeof XMLHttpRequest === 'undefined') {
  global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

FormData = global.FormData || function() {};

promises = require('./promises');

sendRequest = function(method, url, data, hooks, callback) {
  var deferred, hook, i, key, len, query, value, xhr;
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
    for (i = 0, len = hooks.length; i < len; i++) {
      hook = hooks[i];
      hook(xhr, data);
    }
  }
  deferred = promises.defer();
  xhr.onreadystatechange = function() {
    var errorMsg, ref, ref1, ref2;
    switch (xhr.readyState) {
      case 3:
        return deferred.progress(xhr);
      case 4:
        try {
          xhr.data = JSON.parse(xhr.responseText);
        } catch (error) {
          xhr.data = null;
        }
        if (xhr.status >= 400) {
          errorMsg = ((ref = xhr.data) != null ? (ref1 = ref.collection) != null ? (ref2 = ref1.error) != null ? ref2.message : void 0 : void 0 : void 0) || '';
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

RequestError = (function(superClass) {
  extend(RequestError, superClass);

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

;require.register("sdk.coffee", function(exports, require, module) {
var Item, ScopedCollection, TeamSnap, add, linking, loadCollections, mergeDefaults, promises, ref, urlExp,
  hasProp = {}.hasOwnProperty;

TeamSnap = require('./teamsnap').TeamSnap;

promises = require('./promises');

loadCollections = require('./loadCollections');

ref = require('./model'), Item = ref.Item, ScopedCollection = ref.ScopedCollection;

urlExp = /^https?:\/\//;

TeamSnap.prototype.loadCollections = function(cachedCollections, callback) {
  if (typeof cachedCollections === 'function') {
    callback = cachedCollections;
    cachedCollections = null;
  }
  return loadCollections(this.request, cachedCollections).then((function(_this) {
    return function(colls) {
      var ref1, ref2, ref3, ref4;
      _this.collections = {};
      Object.keys(colls).forEach(function(name) {
        return _this.collections[name] = new ScopedCollection(_this.request, colls[name]);
      });
      _this.apiVersion = colls.root.version;
      _this.plans = Item.fromArray(_this.request, ((ref1 = colls.plans.items) != null ? ref1.slice() : void 0) || []);
      _this.smsGateways = Item.fromArray(_this.request, ((ref2 = colls.smsGateways.items) != null ? ref2.slice() : void 0) || []);
      _this.sports = Item.fromArray(_this.request, ((ref3 = colls.sports.items) != null ? ref3.slice() : void 0) || []);
      _this.timeZones = Item.fromArray(_this.request, ((ref4 = colls.timeZones.items) != null ? ref4.slice() : void 0) || []);
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
    if (typeof (valueA != null ? valueA.localeCompare : void 0) === 'function') {
      return valueA.localeCompare(valueB);
    } else {
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
    if (typeof (valueA != null ? valueA.localeCompare : void 0) === 'function') {
      return valueA.localeCompare(valueB);
    } else {
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
  var key, results, value;
  results = [];
  for (key in module) {
    value = module[key];
    results.push(TeamSnap.prototype[key] = value);
  }
  return results;
};

add(require('./types'));

linking = require('./linking');

TeamSnap.prototype.linkItems = linking.linkItems;

TeamSnap.prototype.unlinkItems = linking.unlinkItems;

add(require('./persistence'));

add(require('./collections/teams'));

add(require('./collections/assignments'));

add(require('./collections/availabilities'));

add(require('./collections/broadcastAlerts'));

add(require('./collections/broadcastEmails'));

add(require('./collections/broadcastEmailAttachments'));

add(require('./collections/contactEmailAddresses'));

add(require('./collections/contactPhoneNumbers'));

add(require('./collections/contacts'));

add(require('./collections/customData'));

add(require('./collections/customFields'));

add(require('./collections/leagueCustomData'));

add(require('./collections/leagueCustomFields'));

add(require('./collections/divisionEvents'));

add(require('./collections/divisionLocations'));

add(require('./collections/divisionMembers'));

add(require('./collections/divisionMembersPreferences'));

add(require('./collections/divisionTeamStandings'));

add(require('./collections/divisions'));

add(require('./collections/divisionsPreferences'));

add(require('./collections/events'));

add(require('./collections/eventStatistics'));

add(require('./collections/facebookPages'));

add(require('./collections/forumPosts'));

add(require('./collections/forumSubscriptions'));

add(require('./collections/forumTopics'));

add(require('./collections/leagueRegistrantDocuments'));

add(require('./collections/locations'));

add(require('./collections/memberAssignments'));

add(require('./collections/memberBalances'));

add(require('./collections/memberEmailAddresses'));

add(require('./collections/memberFiles'));

add(require('./collections/memberLinks'));

add(require('./collections/memberPayments'));

add(require('./collections/memberPhoneNumbers'));

add(require('./collections/memberPhotos'));

add(require('./collections/membersPreferences'));

add(require('./collections/memberStatistics'));

add(require('./collections/memberRegistrationSignups'));

add(require('./collections/members'));

add(require('./collections/messageData'));

add(require('./collections/messages'));

add(require('./collections/opponents'));

add(require('./collections/opponentsResults'));

add(require('./collections/paymentNotes'));

add(require('./collections/plans'));

add(require('./collections/sponsors'));

add(require('./collections/sports'));

add(require('./collections/registrationForms'));

add(require('./collections/statisticAggregates'));

add(require('./collections/statistics'));

add(require('./collections/statisticData'));

add(require('./collections/statisticGroups'));

add(require('./collections/teamFees'));

add(require('./collections/teamMedia'));

add(require('./collections/teamMediumComments'));

add(require('./collections/teamMediaGroups'));

add(require('./collections/teamPublicSites'));

add(require('./collections/teamsPaypalPreferences'));

add(require('./collections/teamPhotos'));

add(require('./collections/teamsPreferences'));

add(require('./collections/teamsResults'));

add(require('./collections/teamStatistics'));

add(require('./collections/trackedItems'));

add(require('./collections/trackedItemStatuses'));

add(require('./collections/users'));

mergeDefaults = function(properties, defaults) {
  var key, obj, value;
  obj = {};
  for (key in properties) {
    if (!hasProp.call(properties, key)) continue;
    value = properties[key];
    if (!(typeof value === 'function' || key.charAt(0) === '_')) {
      obj[key] = value;
    }
  }
  for (key in defaults) {
    if (!hasProp.call(defaults, key)) continue;
    value = defaults[key];
    if (!(typeof value === 'function' || properties.hasOwnProperty(key))) {
      obj[key] = value;
    }
  }
  return obj;
};

});

require.register("teamsnap.coffee", function(exports, require, module) {
var Collection, Item, TeamSnap, promises, ref;

promises = require('./promises');

ref = require('./model'), Collection = ref.Collection, Item = ref.Item;

require('./errors');

TeamSnap = (function() {
  TeamSnap.prototype.version = '1.23.1';

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

;require.register("types.coffee", function(exports, require, module) {
var i, len, plural, pluralLookup, singularLookup, teamTypes, teamsnap, type, typeLookup, types;

teamsnap = exports;

types = ['user', 'assignment', 'availability', 'broadcastAlert', 'broadcastEmail', 'broadcastEmailAttachment', 'contact', 'contactEmailAddress', 'contactPhoneNumber', 'customDatum', 'customField', 'leagueCustomDatum', 'leagueCustomField', 'divisionContact', 'divisionContactEmailAddress', 'divisionContactPhoneNumber', 'divisionEvent', 'divisionLocation', 'divisionMember', 'divisionMemberEmailAddress', 'divisionMemberPhoneNumber', 'divisionMemberPreferences', 'divisionTeamStanding', 'divisionPreferences', 'division', 'event', 'eventStatistic', 'facebookPage', 'forumPost', 'forumSubscription', 'forumTopic', 'leagueRegistrantDocument', 'location', 'member', 'memberAssignment', 'memberBalance', 'memberEmailAddress', 'memberFile', 'memberLink', 'memberPayment', 'memberPhoneNumber', 'memberPhoto', 'memberPreferences', 'memberStatistic', 'memberRegistrationSignup', 'message', 'messageDatum', 'opponent', 'opponentResults', 'paymentNote', 'plan', 'registrationForm', 'smsGateway', 'sponsor', 'statistic', 'statisticAggregate', 'statisticDatum', 'statisticGroup', 'sport', 'team', 'teamFee', 'teamMedium', 'teamMediumComment', 'teamMediaGroup', 'teamPaypalPreferences', 'teamPhoto', 'teamPreferences', 'teamPublicSite', 'teamResults', 'teamStatistic', 'timeZone', 'trackedItem', 'trackedItemStatus'];

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
  divisionMemberPreferences: 'divisionMembersPreferences',
  divisionPreferences: 'divisionsPreferences',
  opponentResults: 'opponentsResults',
  statisticDatum: 'statisticData',
  messageDatum: 'messageData',
  teamMedium: 'teamMedia',
  teamPaypalPreferences: 'teamsPaypalPreferences',
  teamPreferences: 'teamsPreferences',
  teamResults: 'teamsResults',
  customDatum: 'customData',
  leagueCustomDatum: 'leagueCustomData',
  smsGateway: 'smsGateways'
};

for (i = 0, len = types.length; i < len; i++) {
  type = types[i];
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