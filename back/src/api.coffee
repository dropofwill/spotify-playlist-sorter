#!/bin/env node

require('coffee-script/register')

express      = require('express')
request      = require('request')
querystring  = require('querystring')
cookieParser = require('cookie-parser')
path         = require('path')
fs           = require('fs')
_            = require('lodash')
SpotifyApi   = require('spotify-web-api-node')

utils        = require('./utils')

if not process.env.SPOTIFY_CLIENT_ID          \
   and not process.env.SPOTIFY_CLIENT_SECRET  \
   and not process.env.UPM_REDIRECT_URI       \
   and not process.env.PORT
  utils.envError()
else
  client_id     = process.env.SPOTIFY_CLIENT_ID
  client_secret = process.env.SPOTIFY_CLIENT_SECRET
  redirect_uri  = process.env.UPM_REDIRECT_URI
  http_port     = process.env.PORT || 3000

stateKey      = 'spotify_auth_state'
accessKey     = 'spotify_access_token'
refreshKey    = 'spotify_refresh_token'
creds =
  clientId:      client_id
  clientSecrect: client_secret
  redirectUri:   redirect_uri

app = express()
app.set('views', path.resolve(path.join(__dirname, "../../views/")))
   .set('view engine', 'jade')
   .disable('x-powered-by')
   .use(express.static("front"))
   .use(cookieParser())

server = app.listen(http_port, (err) -> utils.logServer(http_port, err))

console.log(creds)
spotify = new SpotifyApi(creds)

# spotify.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
#   .then(
#     (data) -> console.log('Artist albums', data.body),
#     (err) -> console.error(err)
#   )

###
# Route to authenticate a Spotify user
###
# app.get('/login', (req, res) ->
#   if spotify.getAccessToken()
#     console.log("You're already signed in")
#   else
#     state = utils.generateRandomString(16)
#     res.cookie(stateKey, state)
#     scopes = ['user-read-private', 'user-read-email']
#
#     authorizeUrl = spotify.createAuthorizeURL(scopes, state)
#     console.log(authorizeUrl)
#     res.redirect(authorizeUrl))

app.get('/login', (req, res) ->
  scopes = ['playlist-modify-public', 'playlist-modify-private']
  state  = new Date().getTime()
  res.cookie(stateKey, state)

  # authoriseURL = spotify.createAuthorizeURL(scopes, state)
  # res.redirect(authoriseURL)

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scopes,
      redirect_uri: redirect_uri,
      state: state })))

app.get('/callback', (req, res) ->
  # your application requests refresh and access tokens
  # after checking the state parameter

  code = req.query.code || null
  state = req.query.state || null
  storedState = if req.cookies then req.cookies[stateKey] else null

  if not state? || state isnt storedState
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }))
  else
    res.clearCookie(stateKey)
    authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' +
        (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true }

    request.post(authOptions, (error, response, body) ->
      if (!error && response.statusCode is 200)
        access_token = body.access_token
        refresh_token = body.refresh_token

        options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true }

        # use the access token to access the Spotify Web API
        request.get(options, (error, response, body) -> console.log(body))

        # can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token }))
      else
        res.redirect('/#' + querystring.stringify({error: 'invalid_token'}))))

# app.get('/callback', (req, res) ->
#   spotify.authorizationCodeGrant(req.query.code)
#     .then((data) ->
#       spotify.setAccessToken(data.body['access_token'])
#       spotify.setRefreshToken(data.body['refresh_token'])
#       res.redirect('/')
#     , (err) ->
#       res.send(err)))

###
# Route that Spotify will hit after authentication
###
# app.get('/callback', (req, res) ->
#   # your application requests refresh and access tokens
#   # after checking the state parameter
#
#   code = req.query.code || null
#   state = req.query.state || null
#   storedState = if req.cookies then req.cookies[stateKey] else null
#
#   console.log("Code: ", code)
#   console.log("Correct state?: ", state is storedState)
#
#   spotify.authorizationCodeGrant(code)
#     .then(
#       (data) ->
#         console.log(data)
#         access_token = data.body['access_token']
#         refresh_token = data.body['refresh_token']
#
#         console.log('The token expires in ' + data.body['expires_in'])
#         console.log('The access token is ' + access_token)
#         console.log('The refresh token is ' + refresh_token)
#         res.cookie(accessKey, access_token)
#         res.cookie(refreshKey, refresh_token)
#         res.redirect('/')
#       , (err) ->
#         res.status(err.code)
#         res.send(err.message)))
#
#   if not state? || state isnt storedState
#     res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }))
#   else
#     res.clearCookie(stateKey)
#     authOptions = {
#       url: 'https://accounts.spotify.com/api/token',
#       form: {
#         code: code,
#         redirect_uri: redirect_uri,
#         grant_type: 'authorization_code'
#       },
#       headers: {
#         'Authorization': 'Basic ' +
#         (new Buffer(client_id + ':' + client_secret).toString('base64'))
#       },
#       json: true }
#
#     request.post(authOptions, (error, response, body) ->
#       if (!error && response.statusCode is 200)
#         access_token = body.access_token
#         refresh_token = body.refresh_token
#
#         options = {
#           url: 'https://api.spotify.com/v1/me',
#           headers: { 'Authorization': 'Bearer ' + access_token },
#           json: true }
#
#         # use the access token to access the Spotify Web API
#         request.get(options, (error, response, body) -> console.log(body))
#
#         # can also pass the token to the browser to make requests from there
#         res.redirect('/#' +
#           querystring.stringify({
#             access_token: access_token,
#             refresh_token: refresh_token }))
#       else
#         res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }))
#   )
# )

###
# Route for the root project page
###
app.get('/', (req, res) ->
  res.render('index', { title: 'Project' }))

###
# Route for the page to experiment with the table interface
###
app.get('/lab', (req, res) ->
  res.render('lab', { title: 'Project' }))

###
# Route for the proposal page
###
app.get('/proposal', (req, res) ->
  res.render('proposal', { title: 'Proposal' }))

###
# Route for the documentation page TODO: not just the proposal page
###
app.get('/documentation', (req, res) ->
  res.render('proposal', { title: 'Proposal' }))
