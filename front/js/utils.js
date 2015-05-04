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
    window.sessionStorage.setItem('echo_api_key', token_data.echo_api_key);
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

  window.get_echo = function() {
    return get_session('echo_api_key');
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

  window.config_global = function(prop) {
    return function() {
      return window[prop] = window[prop] || {};
    };
  };

  window.config_app = config_global("app");


  /*
   * Obtains parameters from the hash of the URL, returns an object 
   * Global because it deals only with the window object
   */

  window.get_hash_bang = function() {
    return location.hash.split("!")[1];
  };


  /*
   * Uses window.get_hash_bang to grab the playlist and user id from the url
   * takes a location.hash of the form '!#playlist_id|user_id'
   * Returns [playlist_id, user_id]
   */

  window.hash_to_user_and_playlist = function() {
    return get_hash_bang().split("|");
  };


  /*
   * Obtains parameters from the hash of the URL, returns array of objects
   * Global because it deals only with the window object
   */

  window.get_hash_pairs = function() {
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
