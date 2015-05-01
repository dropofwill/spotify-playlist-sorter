(function() {
  var _, config, qs, utils;

  utils = exports;

  _ = require('lodash');

  qs = require('querystring');

  config = require('./config');


  /*
   * Returns a random alpha-numeric character
   */

  utils.random_alpha_numeric = function() {
    var possible;
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return possible.charAt(Math.floor(Math.random() * possible.length));
  };


  /*
   * Generates a random string containing numbers and letters
   * param  {number} length The length of the string
   * return {string} The generated string
   */

  utils.generate_random_string = function(length) {
    var text;
    text = '';
    _.times(length, function() {
      return text += utils.random_alpha_numeric();
    });
    return text;
  };


  /*
   * Warn user about missing environment variables
   */

  utils.env_error = function() {
    console.log("Please add the following to your shell env: \n SPOTIFY_CLIENT_ID='your_client_id'  \n SPOTIFY_CLIENT_SECRET='your_secret' \n UPM_REDIRECT_URI='your_redirect_uri' \n");
    return process.exit(1);
  };


  /*
   * Give the console some nice feedback when starting the node server
   */

  utils.log_server = function(port, err) {
    if (err) {
      return console.log(err);
    } else {
      return console.log("===== Serving on port " + port + " ======");
    }
  };


  /*
   * Returns a URL string for phase 1 of the OAuth 2 process
   * Requires a string state parameter
   * Optionally pass a string host, string path, or array of scopes
   */

  utils.auth_builder = function(state, host, path, scopes) {
    var scope;
    if (host == null) {
      host = config.accounts_host;
    }
    if (path == null) {
      path = config.auth_path;
    }
    if (scopes == null) {
      scopes = ['user-read-private', 'user-read-email'];
    }
    scope = scopes.join(" ");
    return url.format({
      protocol: 'https',
      hostname: host,
      pathname: path,
      query: {
        response_type: 'code',
        client_id: config.client_id,
        redirect_uri: config.redirect_uri,
        state: state,
        scope: scope
      }
    });
  };

}).call(this);

//# sourceMappingURL=utils.js.map
