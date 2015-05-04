(function() {
  "use strict";

  /* Dev Mode: console.logs are running
   * window.DEBUG = true
   * Prod Mode: console.logs are off
   * window.DEBUG = false
   */
  var slice = [].slice;

  window.DEBUG = true;

  window.set_tokens = function(token_data) {
    window.sessionStorage.setItem('access_token', token_data.access_token);
    window.sessionStorage.setItem('refresh_token', token_data.refresh_token);
    return window.sessionStorage.setItem('user_id', token_data.user_id);
  };

  window.get_session = function(key) {
    return window.sessionStorage.getItem(key);
  };

  window.get_access = function() {
    return get_session('access_token');
  };

  window.get_refresh = function() {
    return get_session('refresh_token');
  };

  window.get_user = function() {
    return get_session('user_id');
  };


  /*
   * l(vals...) allows for easy debug toggling with the global constant DEBUG
   * Pass in as many arguments as you like and they will be logged out
   */

  window.l = function() {
    var vals;
    vals = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (DEBUG) {
      return console.log.apply(console, vals);
    }
  };


  /*
   * Defines a function which creates or adds onto an existing object in the
   * global scope
   * prop: global property on the window object
   */

  window.configGlobal = function(prop) {
    return function() {
      return window[prop] = window[prop] || {};
    };
  };

  window.configApp = configGlobal("app");


  /*
   * Obtains parameters from the hash of the URL, returns an object 
   * Global because it deals only with the window object
   */

  window.getHashParams = function() {
    var e, hashParams, q, r;
    hashParams = {};
    e = r = /([^&;=]+)=?([^&;]*)/g;
    q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  };


  /*
   * Obtains parameters from the hash of the URL, returns array of objects
   * Global because it deals only with the window object
   */

  window.getHashPairs = function() {
    return location.hash.substr(1).split('&').map(function(pair) {
      var kv;
      kv = pair.split('=', 2);
      if (kv.length === 2) {
        return [decodeURIComponent(kv[0]), decodeURIComponent(kv[1])];
      } else {
        return [decodeURIComponent(kv[0]), null];
      }
    });
  };

}).call(this);

//# sourceMappingURL=utils.js.map
