#!/bin/env node
require('coffee-script/register')

express      = require('express')
request      = require('request')
url          = require('url')
qs           = require('querystring')
cookieParser = require('cookie-parser')
path         = require('path')
fs           = require('fs')
_            = require('lodash')

config       = require('./config')
utils        = require('./utils')


app = express()
   .set('views', config.views_dir)
   .set('view engine', config.view_engine)
   .disable('x-powered-by')
   .use(express.static("front"))
   .use(cookieParser())

console.log(utils.auth_builder("yolo"))

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
###
app.get('/login', (req, res) ->
  state = utils.generate_random_string(16)
  res.cookie(config.state_key, state)

  # Request authorization
  url_obj =
    protocol: 'https'
    hostname: config.accounts_host
    pathname: config.auth_path
    query:
      response_type:  'code'
      client_id:      config.client_id
      redirect_uri:   config.redirect_uri
      state:          state
      scope:          'user-read-private user-read-email'

  url_obj = utils.auth_builder(state)

  url_str = url.format(url_obj)
  console.log(url_str)

  res.redirect(url_str))

###
# Route that Spotify will hit after authentication
###
app.get('/callback', (req, res) ->
  # your application requests refresh and access tokens
  # after checking the state parameter

  code = req.query.code || null
  state = req.query.state || null
  stored_state = if req.cookies then req.cookies[config.state_key] else null

  if not state? || state isnt stored_state
    res.redirect('/#' + qs.stringify(error: 'state_mismatch'))
  else
    res.clearCookie(config.state_key)
    auth_options =
      url: 'https://accounts.spotify.com/api/token'
      form:
        code: code
        redirect_uri: config.redirect_uri
        grant_type: 'authorization_code'
      headers:
        'Authorization': 'Basic ' +
        (new Buffer(config.client_id + ':' + config.client_secret).toString('base64'))
      json: true

    request.post(auth_options, (error, response, body) ->
      if (!error && response.statusCode is 200)
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
        res.redirect('/#' + qs.stringify(error: 'invalid_token'))))

app.get('/refresh_token', (req, res) ->
  # requesting access token from refresh token
  refresh_token = req.query.refresh_token
  auth_options =
    url: 'https://accounts.spotify.com/api/token'
    headers:
      'Authorization': 'Basic ' +
      (new Buffer(client_id + ':' + client_secret).toString('base64'))
    form:
      grant_type: 'refresh_token'
      refresh_token: refresh_token
    json: true

  request.post(auth_options, (error, response, body) ->
    if (!error && response.statusCode is 200)
      access_token = body.access_token
      res.send('access_token': access_token)))
