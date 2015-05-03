(function() {
  var config, qs, spotify, url, utils;

  spotify = exports;

  qs = require('querystring');

  url = require('url');

  config = require('./config');

  utils = require('./utils');


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
      scopes = config.scopes;
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


  /*
   * Returns an options object for a post request to either retrieve an access
   * token (default) or refresh the current one (by passing in 'refresh_token' to
   * the grant param.
   */

  spotify.token_builder = function(code, grant, host, path) {
    var form, url_str;
    if (grant == null) {
      grant = 'authorization_code';
    }
    if (host == null) {
      host = config.accounts_host;
    }
    if (path == null) {
      path = config.token_path;
    }
    url_str = url.format({
      protocol: 'https',
      hostname: host,
      pathname: path
    });
    if (grant === 'authorization_code') {
      form = {
        grant_type: grant,
        code: code,
        redirect_uri: config.redirect_uri
      };
    } else {
      form = {
        grant_type: grant,
        refresh_token: refresh_token
      };
    }
    return {
      url: url_str,
      form: form,
      headers: {
        'Authorization': utils.basic_auth_header()
      },
      json: true
    };
  };


  /*
   * Returns an options object for a post request to a previously created spotify
   * endpoint that is passed in as the first parameter. The endpoint should start
   * with a / and include everything after the version number
   */

  spotify.query_builder = function(endpoint, access_token, query_obj, host, path) {
    if (query_obj == null) {
      query_obj = null;
    }
    if (host == null) {
      host = config.api_host;
    }
    if (path == null) {
      path = config.api_path;
    }
    if (query_obj != null) {
      url = url.format({
        protocol: 'https'
      }, {
        hostname: host,
        pathname: path + endpoint,
        query: query_obj
      });
    } else {
      url = url.format({
        protocol: 'https'
      }, {
        hostname: host,
        pathname: path + endpoint
      });
    }
    return {
      url: url,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      json: true
    };
  };

  spotify.get_me = function(access_token, host, path) {
    if (host == null) {
      host = config.api_host;
    }
    if (path == null) {
      path = config.api_path;
    }
    return spotify.query_builder("/me", access_token);
  };

}).call(this);

//# sourceMappingURL=spotify.js.map
