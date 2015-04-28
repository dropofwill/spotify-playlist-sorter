(function() {
  var SpotifyApi, _, accessKey, app, client_id, client_secret, cookieParser, creds, express, fs, http_port, path, querystring, redirect_uri, refreshKey, request, server, spotify, stateKey, utils;

  require('coffee-script/register');

  express = require('express');

  request = require('request');

  querystring = require('querystring');

  cookieParser = require('cookie-parser');

  path = require('path');

  fs = require('fs');

  _ = require('lodash');

  SpotifyApi = require('spotify-web-api-node');

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

  app.set('views', path.resolve(path.join(__dirname, "../../views/"))).set('view engine', 'jade').disable('x-powered-by').use(express["static"]("front")).use(cookieParser());

  server = app.listen(http_port, function(err) {
    return utils.logServer(http_port, err);
  });

  spotify = new SpotifyApi(creds);


  /*
   * Route to authenticate a Spotify user
   */

  app.get('/login', function(req, res) {
    var authorizeUrl, scopes, state;
    if (spotify.getAccessToken()) {
      return console.log("You're already signed in");
    } else {
      state = utils.generateRandomString(16);
      res.cookie(stateKey, state);
      scopes = ['user-read-private', 'user-read-email'];
      authorizeUrl = spotify.createAuthorizeURL(scopes, state);
      return res.redirect(authorizeUrl);
    }
  });


  /*
   * Route that Spotify will hit after authentication
   */

  app.get('/callback', function(req, res) {
    var code, state, storedState;
    code = req.query.code || null;
    state = req.query.state || null;
    storedState = req.cookies ? req.cookies[stateKey] : null;
    console.log("Code: ", code);
    console.log("Correct state?: ", state === storedState);
    return spotify.authorizationCodeGrant(code).then(function(data) {
      var access_token, refresh_token;
      console.log(data);
      access_token = data.body['access_token'];
      refresh_token = data.body['refresh_token'];
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + access_token);
      console.log('The refresh token is ' + refresh_token);
      res.cookie(accessKey, access_token);
      res.cookie(refreshKey, refresh_token);
      return res.redirect('/');
    }, function(err) {
      res.status(err.code);
      return res.send(err.message);
    });
  });


  /*
   * Route for the root project page
   */

  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'Project'
    });
  });


  /*
   * Route for the page to experiment with the table interface
   */

  app.get('/lab', function(req, res) {
    return res.render('lab', {
      title: 'Project'
    });
  });


  /*
   * Route for the proposal page
   */

  app.get('/proposal', function(req, res) {
    return res.render('proposal', {
      title: 'Proposal'
    });
  });


  /*
   * Route for the documentation page TODO: not just the proposal page
   */

  app.get('/documentation', function(req, res) {
    return res.render('proposal', {
      title: 'Proposal'
    });
  });

}).call(this);

//# sourceMappingURL=api.js.map
