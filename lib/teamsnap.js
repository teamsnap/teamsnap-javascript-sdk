(function() {
var window, global = {};
(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
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
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
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
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
var require = global.require;
global = this;
if (global.window) window = this;
require.register("auth", function(exports, require, module) {
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
    var e, error, params, response;
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
  var ref;
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

});

require.register("collections/availabilities", function(exports, require, module) {
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

require.register("collections/broadcastAlerts", function(exports, require, module) {
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

require.register("collections/broadcastEmailAttachments", function(exports, require, module) {
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

require.register("collections/broadcastEmails", function(exports, require, module) {
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
  if (!broadcastEmail.teamId) {
    return this.reject('You must provide a team id.', 'teamId', callback);
  }
  if (!broadcastEmail.memberId) {
    return this.reject('You must provide a member id.', 'memberId', callback);
  }
  if (!((ref = broadcastEmail.body) != null ? ref.trim() : void 0)) {
    return this.reject('You must provide the text alert body.', 'body', callback);
  }
  return this.saveItem(broadcastEmail, callback);
};

exports.deleteBroadcastEmail = function(broadcastEmail, callback) {
  if (!broadcastEmail) {
    throw new TSArgsError('teamsnap.deleteBroadcastEmail', '`broadcastEmail` must be provided');
  }
  return this.deleteItem(broadcastEmail, callback);
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

require.register("collections/divisionLocations", function(exports, require, module) {
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

require.register("collections/divisionMemberPreferences", function(exports, require, module) {
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

require.register("collections/divisionMembers", function(exports, require, module) {
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

require.register("collections/divisionTeamStandings", function(exports, require, module) {
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

require.register("collections/eventStatistics", function(exports, require, module) {
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

require.register("collections/events", function(exports, require, module) {
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

require.register("collections/facebookPages", function(exports, require, module) {
exports.loadFacebookPages = function(callback) {
  var params;
  params = {};
  return this.loadItems('facebookPage', params, callback);
};

});

require.register("collections/forumPosts", function(exports, require, module) {
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

require.register("collections/forumSubscriptions", function(exports, require, module) {
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

require.register("collections/forumTopics", function(exports, require, module) {
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

require.register("collections/leagueCustomData", function(exports, require, module) {
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

require.register("collections/leagueCustomFields", function(exports, require, module) {
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

require.register("collections/leagueRegistrantDocuments", function(exports, require, module) {
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

require.register("collections/memberBalances", function(exports, require, module) {
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

require.register("collections/memberPayments", function(exports, require, module) {
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

require.register("collections/memberStatistics", function(exports, require, module) {
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

require.register("collections/paymentNotes", function(exports, require, module) {
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

require.register("collections/receivedMessages", function(exports, require, module) {
exports.loadReceivedMessages = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadReceivedMessages', 'must provide a teamId or query parameters');
  }
  return this.loadItems('receivedMessage', params, callback);
};

exports.markReceivedMessageAsRead = function(id, callback) {
  var params;
  params = {
    id: id
  };
  return this.collections.receivedMessages.exec('markReceivedMessageAsRead', params).pop().callback(callback);
};

});

require.register("collections/sentMessages", function(exports, require, module) {
exports.loadSentMessages = function(params, callback) {
  if (this.isId(params)) {
    params = {
      teamId: params
    };
  } else if (!(params && typeof params === 'object')) {
    throw new TSArgsError('teamsnap.loadSentMessages', 'must provide a teamId or query parameters');
  }
  return this.loadItems('sentMessage', params, callback);
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

require.register("collections/statisticAggregates", function(exports, require, module) {
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

require.register("collections/statisticData", function(exports, require, module) {
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

require.register("collections/statisticGroups", function(exports, require, module) {
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

require.register("collections/statistics", function(exports, require, module) {
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

require.register("collections/teamFees", function(exports, require, module) {
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

require.register("collections/teamMedia", function(exports, require, module) {
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

require.register("collections/teamMediaGroups", function(exports, require, module) {
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

require.register("collections/teamMediumComments", function(exports, require, module) {
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

require.register("collections/teamPaypalPreferences", function(exports, require, module) {
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

require.register("collections/teamStatistics", function(exports, require, module) {
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

require.register("errors", function(exports, require, module) {
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

require.register("model", function(exports, require, module) {
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
    var entry, rel, results;
    results = [];
    for (rel in this) {
      if (!hasProp.call(this, rel)) continue;
      entry = this[rel];
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
    var clone, entry, rel;
    clone = new MetaList();
    for (rel in this) {
      if (!hasProp.call(this, rel)) continue;
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

require.register("persistence", function(exports, require, module) {
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
  wrapMethod(sdk, 'saveBroadcastAlert', function(saveBroadcastAlert) {
    return function(broadcastAlert, callback) {
      return saveBroadcastAlert.call(this, broadcastAlert, callback).then(function(result) {
        var memberId;
        memberId = result.memberId;
        return promises.when(sdk.loadReceivedMessages({
          memberId: memberId
        }), sdk.loadSentMessages({
          memberId: memberId
        })).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'markReceivedMessageAsRead', function(markReceivedMessageAsRead) {
    return function(receivedMessage, callback) {
      return markReceivedMessageAsRead.call(this, receivedMessage, callback).then(function(result) {
        var memberId;
        memberId = result.memberId;
        return promises.when(sdk.loadReceivedMessages({
          memberId: memberId
        })).then(function() {
          return result;
        });
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
      linking.unlinkItems(toRemove, lookup);
      return deleteStatistic.call(this, statistic).fail(function(err) {
        linking.linkItems(toRemove, lookup);
        return err;
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'saveStatistic', function(saveStatistic) {
    return function(statistic, callback) {
      return saveStatistic.call(this, statistic, callback).then(function(result) {
        var bulkLoadTypes, statisticId, teamId;
        teamId = statistic.teamId;
        statisticId = result.id;
        bulkLoadTypes = ['memberStatistic', 'teamStatistic', 'statisticAggregate'];
        return promises.when(sdk.bulkLoad(teamId, bulkLoadTypes), sdk.loadEventStatistics({
          statisticId: statisticId
        })).then(function() {
          return result;
        });
      }).callback(callback);
    };
  });
  wrapMethod(sdk, 'bulkSaveStatisticData', function(bulkSaveStatisticData) {
    return function(templates, callback) {
      return bulkSaveStatisticData.call(this, templates, callback).then(function(result) {
        var bulkLoadTypes, statisticId, teamId;
        if ((result[0] != null) && (result[0].teamId != null)) {
          teamId = result[0].teamId;
          statisticId = result[0].statisticId;
          bulkLoadTypes = ['memberStatistic', 'statisticAggregate'];
          return promises.when(sdk.bulkLoad(teamId, bulkLoadTypes), sdk.loadEventStatistics({
            statisticId: statisticId
          })).then(function() {
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
        bulkLoadTypes = ['memberStatistic', 'statisticAggregate'];
        return promises.when(sdk.bulkLoad(teamId, bulkLoadTypes), sdk.loadEventStatistics({
          statisticId: statisticId
        })).then(function() {
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
        var bulkLoadTypes, eventId, teamId;
        return promises.when(teamId = member.teamId, eventId = event.id, bulkLoadTypes = ['memberStatistic', 'statisticAggregate'], sdk.bulkLoad(teamId, bulkLoadTypes), sdk.loadEventStatistics({
          eventId: eventId
        })).then(function() {
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
        return sdk.loadTeam(teamMedium.teamId).then(function() {
          return result;
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
        return sdk.loadTeam(teamMedium.teamId).then(function() {
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
          return sdk.loadTeam(teamId).then(function() {
            return result;
          });
        } else {
          return result;
        }
      });
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
  return wrapMethod(sdk, 'deleteForumTopic', function(deleteForumTopic) {
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

require.register("request", function(exports, require, module) {
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
    var error, errorMsg, ref, ref1, ref2;
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

;require.register("sdk", function(exports, require, module) {
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

add(require('./collections/divisionLocations'));

add(require('./collections/divisionMembers'));

add(require('./collections/divisionMemberPreferences'));

add(require('./collections/divisionTeamStandings'));

add(require('./collections/events'));

add(require('./collections/eventStatistics'));

add(require('./collections/facebookPages'));

add(require('./collections/forumPosts'));

add(require('./collections/forumSubscriptions'));

add(require('./collections/forumTopics'));

add(require('./collections/leagueRegistrantDocuments'));

add(require('./collections/locations'));

add(require('./collections/memberBalances'));

add(require('./collections/memberEmailAddresses'));

add(require('./collections/memberFiles'));

add(require('./collections/memberLinks'));

add(require('./collections/memberPayments'));

add(require('./collections/memberPhoneNumbers'));

add(require('./collections/memberPreferences'));

add(require('./collections/memberStatistics'));

add(require('./collections/members'));

add(require('./collections/opponents'));

add(require('./collections/opponentResults'));

add(require('./collections/paymentNotes'));

add(require('./collections/plans'));

add(require('./collections/receivedMessages'));

add(require('./collections/sentMessages'));

add(require('./collections/sponsors'));

add(require('./collections/sports'));

add(require('./collections/statisticAggregates'));

add(require('./collections/statistics'));

add(require('./collections/statisticData'));

add(require('./collections/statisticGroups'));

add(require('./collections/teamFees'));

add(require('./collections/teamMedia'));

add(require('./collections/teamMediumComments'));

add(require('./collections/teamMediaGroups'));

add(require('./collections/teamPaypalPreferences'));

add(require('./collections/teamPreferences'));

add(require('./collections/teamPublicSites'));

add(require('./collections/teamResults'));

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

require.register("teamsnap", function(exports, require, module) {
var Collection, Item, TeamSnap, promises, ref;

promises = require('./promises');

ref = require('./model'), Collection = ref.Collection, Item = ref.Item;

require('./errors');

TeamSnap = (function() {
  TeamSnap.prototype.version = '1.7.0-pre23';

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
var i, len, plural, pluralLookup, singularLookup, teamTypes, teamsnap, type, typeLookup, types;

teamsnap = exports;

types = ['user', 'assignment', 'availability', 'broadcastAlert', 'broadcastEmail', 'broadcastEmailAttachment', 'contact', 'contactEmailAddress', 'contactPhoneNumber', 'customDatum', 'customField', 'leagueCustomDatum', 'leagueCustomField', 'divisionContact', 'divisionContactEmailAddress', 'divisionContactPhoneNumber', 'divisionLocation', 'divisionMember', 'divisionMemberEmailAddress', 'divisionMemberPhoneNumber', 'divisionMemberPreferences', 'divisionTeamStanding', 'event', 'eventStatistic', 'facebookPage', 'forumPost', 'forumSubscription', 'forumTopic', 'leagueRegistrantDocument', 'location', 'member', 'memberBalance', 'memberEmailAddress', 'memberFile', 'memberLink', 'memberPayment', 'memberPhoneNumber', 'memberPreferences', 'memberStatistic', 'opponent', 'opponentResults', 'paymentNote', 'plan', 'receivedMessage', 'sentMessage', 'smsGateway', 'sponsor', 'statistic', 'statisticAggregate', 'statisticDatum', 'statisticGroup', 'sport', 'team', 'teamFee', 'teamMedium', 'teamMediumComment', 'teamMediaGroup', 'teamPaypalPreferences', 'teamPreferences', 'teamPublicSite', 'teamResults', 'teamStatistic', 'timeZone', 'trackedItem', 'trackedItemStatus'];

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
  opponentResults: 'opponentsResults',
  statisticDatum: 'statisticData',
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