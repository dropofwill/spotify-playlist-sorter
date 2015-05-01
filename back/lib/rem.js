(function() {
  var _, accessKey, app, client_id, client_secret, cookieParser, creds, express, fs, http_port, oauth, path, querystring, redirect_uri, refreshKey, rem, request, server, spotify, stateKey, utils;

  require('coffee-script/register');

  express = require('express');

  request = require('request');

  querystring = require('querystring');

  cookieParser = require('cookie-parser');

  path = require('path');

  fs = require('fs');

  rem = require('rem');

  _ = require('lodash');

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
    key: client_id,
    secret: client_secret
  };

  app = express();

  app.set('views', path.resolve(path.join(__dirname, "../../views/"))).set('view engine', 'jade').disable('x-powered-by').use(express["static"]("front")).use(cookieParser());

  server = app.listen(http_port, function(err) {
    return utils.logServer(http_port, err);
  });

  spotify = rem.connect('api.spotify.com', 1.0).configure(creds);

  oauth = rem.oauth(spotify, redirect_uri);


  /*
   * Route for the root project page
   */

  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'Project'
    });
  });

  app.use(oauth.middleware(function(req, res, next) {
    console.log("authenticated");
    return res.redirect('/');
  }));

  app.get('/login/', oauth.login());

  app.get('/logout/', oauth.logout());

}).call(this);

//# sourceMappingURL=rem.js.map
