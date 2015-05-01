(function() {
  var SpotifyApi, _, accessKey, app, client_id, client_secret, cookieParser, creds, express, fs, http_port, parse, path, querystring, redirect_uri, refreshKey, request, server, spotify, stateKey, utils;

  require('coffee-script/register');

  express = require('express');

  request = require('request');

  parse = require('url-parse');

  querystring = require('querystring');

  cookieParser = require('cookie-parser');

  path = require('path');

  fs = require('fs');

  _ = require('lodash');

  SpotifyApi = require('spotify-web-api-node');

  utils = require('./utils');

  if (!process.env.SPOTIFY_CLIENT_ID && !process.env.SPOTIFY_CLIENT_SECRET && !process.env.UPM_REDIRECT_URI(utils.envError())) {

  } else {
    client_id = process.env.SPOTIFY_CLIENT_ID;
    client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    redirect_uri = process.env.UPM_REDIRECT_URI;
    http_port = pares(redirect_uri).port;
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

  console.log(creds);

  spotify = new SpotifyApi(creds);


  /*
   * Route to authenticate a Spotify user
   */

  app.get('/login', function(req, res) {
    var scopes, state;
    scopes = ['playlist-modify-public', 'playlist-modify-private'];
    state = new Date().getTime();
    res.cookie(stateKey, state);
    return res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scopes,
      redirect_uri: redirect_uri,
      state: state
    }));
  });

  app.get('/callback', function(req, res) {
    var authOptions, code, state, storedState;
    code = req.query.code || null;
    state = req.query.state || null;
    storedState = req.cookies ? req.cookies[stateKey] : null;
    if ((state == null) || state !== storedState) {
      return res.redirect('/#' + querystring.stringify({
        error: 'state_mismatch'
      }));
    } else {
      res.clearCookie(stateKey);
      authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
      return request.post(authOptions, function(error, response, body) {
        var access_token, options, refresh_token;
        if (!error && response.statusCode === 200) {
          access_token = body.access_token;
          refresh_token = body.refresh_token;
          options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            json: true
          };
          request.get(options, function(error, response, body) {
            return console.log(body);
          });
          return res.redirect('/#' + querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
        } else {
          return res.redirect('/#' + querystring.stringify({
            error: 'invalid_token'
          }));
        }
      });
    }
  });


  /*
   * Route that Spotify will hit after authentication
   */


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
