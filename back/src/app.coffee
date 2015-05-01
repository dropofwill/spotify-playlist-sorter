#!/bin/env node
require('coffee-script/register')

express      = require('express')
request      = require('request')
url          = require('url')
qs           = require('querystring')
cookieParser = require('cookie-parser')
path         = require('path')
fs           = require('fs')

config       = require('./config')
utils        = require('./utils')
spotify      = require('./spotify')

app = express()
   .set('views', config.views_dir)
   .set('view engine', config.view_engine)
   .disable('x-powered-by')
   .use(express.static("front"))
   .use(cookieParser())

server = app.listen(config.port, (err) -> utils.log_server(config.port, err))

###
# Route for the root project page
###
app.get('/', (req, res) ->
  res.render('index', title: 'Project'))

###
# Route for the page to experiment with the table interface
###
app.get('/lab', (req, res) ->
  res.render('lab', title: 'Project'))

###
# Route for the proposal page
###
app.get('/proposal', (req, res) ->
  res.render('proposal', title: 'Proposal'))

###
# Route for the documentation page TODO: not just the proposal page
###
app.get('/documentation', (req, res) ->
  res.render('proposal', title: 'Proposal'))

###
# Route to authenticate a Spotify user
# Generate a random string to save on the client to verify that after the
# callback its still the same client
# Finally redirect to Spotify to authenticate
###
app.get('/login', (req, res) ->
  state = utils.generate_random_string(16)
  res.cookie(config.state_key, state)
  res.redirect(spotify.auth_builder(state)))

###
# Route that Spotify will hit after authentication
# Application requests refresh and access tokens
# after checking the state parameter
###
app.get('/callback', (req, res) ->
  code = req.query.code ? null

  if utils.client_has_correct_state(req)
    res.clearCookie(config.state_key)
    auth_options = spotify.token_builder(code)

    request.post(auth_options, (error, response, body) ->
      if not error and 200 >= response.statusCode < 300
        access_token = body.access_token
        refresh_token = body.refresh_token

        options =
          url: 'https://api.spotify.com/v1/me'
          headers:
            'Authorization': 'Bearer ' + access_token
          json: true

        # use the access token to access the Spotify Web API
        request.get(options, (error, response, body) -> console.log(body))

        # can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          qs.stringify(
            access_token: access_token,
            refresh_token: refresh_token))
      else
        res.redirect(utils.local_error_builder(error, response.statusCode)))
  else
    res.redirect(utils.local_error_builder('state_mismatch')))

app.get('/refresh_token', (req, res) ->
  # requesting access token from refresh token
  refresh_token = req.query.refresh_token
  auth_options =
    url: 'https://accounts.spotify.com/api/token'
    headers:
      'Authorization': utils.basic_auth_header()
    form:
      grant_type: 'refresh_token'
      refresh_token: refresh_token
    json: true

  request.post(auth_options, (error, response, body) ->
    if not error and response.statusCode is 200
      access_token = body.access_token
      res.send('access_token': access_token)))
