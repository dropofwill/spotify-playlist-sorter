(function() {
  var app, config, cookieParser, express, fs, path, qs, request, server, spotify, url, utils;

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

  spotify = require('./spotify');

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
    var auth_opts, code, ref;
    code = (ref = req.query.code) != null ? ref : null;
    if (utils.client_has_correct_state(req)) {
      res.clearCookie(config.state_key);
      auth_opts = spotify.token_builder(code);
      return request.post(auth_opts, function(error, response, body) {});
    } else {
      return res.redirect(utils.local_error_builder('state_mismatch'));
    }
  });

  app.get('/refresh_token', function(req, res) {
    var auth_options, refresh_token;
    refresh_token = req.query.refresh_token;
    auth_options = spotify.token_builder(code, 'refresh_token');
    return request.post(auth_options, function(error, response, body) {
      var access_token;
      if (utils.was_good_response(error, response)) {
        access_token = body.access_token;
        return res.send({
          'access_token': access_token
        });
      }
    });
  });

}).call(this);

//# sourceMappingURL=app.js.map
