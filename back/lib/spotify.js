(function() {
  var config, qs, spotify, url;

  spotify = exports;

  qs = require('querystring');

  url = require('url');

  config = require('./config');


  /*
   * Returns a URL string for phase 1 of the OAuth 2 process
   * Requires a string state parameter
   * Optionally pass a string host, string path, or array of scopes
   */

  spotify.auth_builder = function(state, host, path, scopes) {
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

  spotify.build_token_req = function() {};

  spotify.build_query_req = function() {};

}).call(this);

//# sourceMappingURL=spotify.js.map
