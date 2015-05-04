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
    authorize_opts = spotify.token_builder(code)

    request.post(authorize_opts, (error, response, body) ->
      if utils.was_good_response(error, response)
        access_token  = body.access_token
        refresh_token = body.refresh_token

        get_me_opts = spotify.get_me_builder(access_token)

        request.get(get_me_opts, (error, response, body) ->
          my_id = body.id

          res.redirect(
            utils.query_builder('/playlists',
              access_token:  access_token
              refresh_token: refresh_token
              echo_api_key:  config.echo_api_key
              user_id:       my_id)))
      else
        res.redirect(utils.local_error_builder(error, response.statusCode)))
  else
    res.redirect(utils.local_error_builder('state_mismatch')))

app.get('/playlists', (req, res) ->
  console.log(req.query)
  res.render('playlist',
    access_token:  req.query.access_token
    refresh_token: req.query.refresh_token
    echo_api_key:  req.query.echo_api_key
    user_id:       req.query.user_id))

app.get('/refresh_token', (req, res) ->
  # requesting access token from refresh token
  refresh_token = req.query.refresh_token
  auth_options = spotify.token_builder(code, 'refresh_token')

  request.post(auth_options, (error, response, body) ->
    if utils.was_good_response(error, response)
      access_token = body.access_token
      res.send('access_token': access_token)))

# get_me_opts = spotify.get_me_builder(access_token)
#
# # use the access token to access the Spotify Web API
# request.get(get_me_opts, (error, response, body) ->
#   console.log("User id: ", body.id)
#   my_id = body.id
#
#   my_playlists_opts = \
#     spotify.get_user_playlists_opts(access_token, my_id)
#
#   request.get(my_playlists_opts, (error, response, body) ->
#     if utils.was_good_response(error, response)
#       console.log(body)
#     else
#       console.log(error, response.statusCode)
#   ))

# can also pass the token to the browser to make requests from there
# res.redirect(utils.hash_builder(
#     access_token: access_token,
#     refresh_token: refresh_token))
