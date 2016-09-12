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

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
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
  require._cache = cache;
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
  return wrapMethod(sdk, 'deleteMemberAssignment', function(deleteMemberAssignment) {
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

add(require('./collections/divisionMembersPreferences'));

add(require('./collections/divisionTeamStandings'));

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

add(require('./collections/members'));

add(require('./collections/messageData'));

add(require('./collections/messages'));

add(require('./collections/opponents'));

add(require('./collections/opponentsResults'));

add(require('./collections/paymentNotes'));

add(require('./collections/plans'));

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

require.register("teamsnap", function(exports, require, module) {
var Collection, Item, TeamSnap, promises, ref;

promises = require('./promises');

ref = require('./model'), Collection = ref.Collection, Item = ref.Item;

require('./errors');

TeamSnap = (function() {
  TeamSnap.prototype.version = '1.15.4';

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

types = ['user', 'assignment', 'availability', 'broadcastAlert', 'broadcastEmail', 'broadcastEmailAttachment', 'contact', 'contactEmailAddress', 'contactPhoneNumber', 'customDatum', 'customField', 'leagueCustomDatum', 'leagueCustomField', 'divisionContact', 'divisionContactEmailAddress', 'divisionContactPhoneNumber', 'divisionLocation', 'divisionMember', 'divisionMemberEmailAddress', 'divisionMemberPhoneNumber', 'divisionMemberPreferences', 'divisionTeamStanding', 'event', 'eventStatistic', 'facebookPage', 'forumPost', 'forumSubscription', 'forumTopic', 'leagueRegistrantDocument', 'location', 'member', 'memberAssignment', 'memberBalance', 'memberEmailAddress', 'memberFile', 'memberLink', 'memberPayment', 'memberPhoneNumber', 'memberPhoto', 'memberPreferences', 'memberStatistic', 'message', 'messageDatum', 'opponent', 'opponentResults', 'paymentNote', 'plan', 'smsGateway', 'sponsor', 'statistic', 'statisticAggregate', 'statisticDatum', 'statisticGroup', 'sport', 'team', 'teamFee', 'teamMedium', 'teamMediumComment', 'teamMediaGroup', 'teamPaypalPreferences', 'teamPhoto', 'teamPreferences', 'teamPublicSite', 'teamResults', 'teamStatistic', 'timeZone', 'trackedItem', 'trackedItemStatus'];

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