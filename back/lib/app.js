(function() {
  var _, app, client_id, client_secret, cookieParser, envError, express, fs, generateRandomString, http_port, path, querystring, randomAlphaNumeric, redirect_uri, request, server, stateKey;

  require('coffee-script/register');

  express = require('express');

  request = require('request');

  querystring = require('querystring');

  cookieParser = require('cookie-parser');

  path = require('path');

  fs = require('fs');

  _ = require('lodash');

  envError = function() {
    console.log("Please add: \n SPOTIFY_CLIENT_ID='your_client_id' \n SPOTIFY_CLIENT_SECRET='your_secret' ");
    return process.exit(1);
  };

  if (!process.env.SPOTIFY_CLIENT_ID) {
    envError();
  }

  if (!process.env.SPOTIFY_CLIENT_SECRET) {
    envError();
  }

  client_id = process.env.SPOTIFY_CLIENT_ID;

  client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  http_port = process.env.PORT || 3000;

  stateKey = 'spotify_auth_state';

  app = express();

  app.set('views', path.resolve(path.join(__dirname, "../../views/")));

  app.set('view engine', 'jade');

  app.disable('x-powered-by');

  app.use(express["static"]("front")).use(cookieParser());

  server = app.listen(http_port, function(err) {
    if (err) {
      return console.log(err);
    } else {
      return console.log("===== Serving on port " + http_port + " ======");
    }
  });

  redirect_uri = "http://localhost:" + http_port + "/callback";


  /*
   * Generates a random string containing numbers and letters
   * param  {number} length The length of the string
   * return {string} The generated string
   */

  generateRandomString = function(length) {
    var text;
    text = '';
    _.times(length, function() {
      return text += randomAlphaNumeric();
    });
    return text;
  };


  /*
   * Returns a random alpha-numeric character
   */

  randomAlphaNumeric = function() {
    var possible;
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return possible.charAt(Math.floor(Math.random() * possible.length));
  };


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


  /*
   * Route to authenticate a Spotify user
   */

  app.get('/login', function(req, res) {
    var scope, state;
    state = generateRandomString(16);
    res.cookie(stateKey, state);
    scope = 'user-read-private user-read-email';
    return res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
  });


  /*
   * Route that Spotify will hit after authentication
   */

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

  app.get('/refresh_token', function(req, res) {
    var authOptions, refresh_token;
    refresh_token = req.query.refresh_token;
    authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
    return request.post(authOptions, function(error, response, body) {
      var access_token;
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        return res.send({
          'access_token': access_token
        });
      }
    });
  });

}).call(this);

//# sourceMappingURL=app.js.map
