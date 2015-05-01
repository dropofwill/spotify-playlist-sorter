(function() {
  var accounts_base_url, api_base_url, api_path, auth_path, auth_url, parse, path, port, redirect_uri, token_path, token_url, url;

  parse = require('url-parse');

  url = require('url');

  path = require('path');


  /*
   * If these environment variable are not set, we cannot continue
   * Throw a warning and kill the process
   */

  if (!process.env.SPOTIFY_CLIENT_ID && !process.env.SPOTIFY_CLIENT_SECRET && !process.env.UPM_REDIRECT_URI) {
    utils.envError();
  }

  redirect_uri = process.env.UPM_REDIRECT_URI;

  port = parse(redirect_uri).port;

  accounts_base_url = 'https://accounts.spotify.com/';

  api_base_url = 'https://api.spotify.com/';

  auth_path = '/authorize';

  token_path = '/api/token';

  api_path = '/v1';

  auth_url = path.resolve(accounts_base_url, auth_path);

  token_url = path.resolve(accounts_base_url, token_path);

  module.exports = {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    redirect_uri: redirect_uri,
    port: port,
    views_dir: path.resolve(path.join(__dirname, "../../views/")),
    view_engine: 'jade',
    state_key: 'spotify_auth_state',
    access_key: 'spotify_access_token',
    refresh_key: 'spotify_refresh_token',
    auth_url: auth_url,
    token_url: token_url
  };

}).call(this);

//# sourceMappingURL=config.js.map
