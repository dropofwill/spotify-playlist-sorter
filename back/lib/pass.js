(function() {
  var SpotifyStrategy, _, accessKey, app, bodyParser, client_id, client_secret, cookieParser, creds, express, http_port, passport, redirect_uri, refreshKey, stateKey, utils;

  require('coffee-script/register');

  express = require('express');

  bodyParser = require('body-parser');

  cookieParser = require('cookie-parser');

  passport = require('passport');

  _ = require('lodash');

  SpotifyStrategy = require('spotify-web-api-node');

  utils = require('./utils');

  if (!process.env.SPOTIFY_CLIENT_ID && !process.env.SPOTIFY_CLIENT_SECRET && !process.env.UPM_REDIRECT_URI && !process.env.PORT) {
    utils.envError();
  } else {
    client_id = process.env.SPOTIFY_CLIENT_ID;
    client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    redirect_uri = process.env.UPM_REDIRECT_URI;
    http_port = process.env.PORT || 3000;
  }

  stateKey = 'spotify_auth_state';

  accessKey = 'spotify_access_token';

  refreshKey = 'spotify_refresh_token';

  creds = {
    clientId: client_id,
    clientSecrect: client_secret,
    redirectUri: redirect_uri
  };

  app = express();

  app.set('views', path.resolve(path.join(__dirname, "../../views/"))).set('view engine', 'jade').disable('x-powered-by').use(express["static"]("front")).use(bodyParser()).use(cookieParser()).use(passport.initialize()).use(passport.session());

}).call(this);

//# sourceMappingURL=pass.js.map
