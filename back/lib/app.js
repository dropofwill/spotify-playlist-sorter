(function() {
  var app, config, cookieParser, express, fs, path, qs, request, server, url, utils;

  require('coffee-script/register');

  express = require('express');

  request = require('request');

  url = require('url');

  qs = require('querystring');

  cookieParser = require('cookie-parser');

  path = require('path');

  fs = require('fs');

  config = require('./config');

  utils = require('./utils');

  app = express().set('views', config.views_dir).set('view engine', config.view_engine).disable('x-powered-by').use(express["static"]("front")).use(cookieParser());

  server = app.listen(config.port, function(err) {
    return utils.log_server(config.port, err);
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


  /*
   * Route to authenticate a Spotify user
   * Generate a random string to save on the client to verify that after the
   * callback its still the same client
   * Finally redirect to Spotify to authenticate
   */

  app.get('/login', function(req, res) {
    var state;
    state = utils.generate_random_string(16);
    res.cookie(config.state_key, state);
    return res.redirect(spotify.auth_builder(state));
  });


  /*
   * Route that Spotify will hit after authentication
   * Application requests refresh and access tokens
   * after checking the state parameter
   */

  app.get('/callback', function(req, res) {
    var auth_options, code, state, stored_state;
    code = req.query.code || null;
    state = req.query.state || null;
    stored_state = req.cookies ? req.cookies[config.state_key] : null;
    if ((state == null) || state !== stored_state) {
      return res.redirect('/#' + qs.stringify({
        error: 'state_mismatch'
      }));
    } else {
      res.clearCookie(config.state_key);
      auth_options = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: config.redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(config.client_id + ':' + config.client_secret).toString('base64'))
        },
        json: true
      };
      return request.post(auth_options, function(error, response, body) {
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
          return res.redirect('/#' + qs.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
        } else {
          return res.redirect('/#' + qs.stringify({
            error: 'invalid_token'
          }));
        }
      });
    }
  });

  app.get('/refresh_token', function(req, res) {
    var auth_options, refresh_token;
    refresh_token = req.query.refresh_token;
    auth_options = {
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
    return request.post(auth_options, function(error, response, body) {
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
