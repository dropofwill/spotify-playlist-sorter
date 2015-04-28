#!/bin/env node

require('coffee-script/register')

express      = require('express')
request      = require('request')
querystring  = require('querystring')
cookieParser = require('cookie-parser')
path         = require('path')
fs           = require('fs')
_            = require('lodash')

envError() if not process.env.SPOTIFY_CLIENT_ID
envError() if not process.env.SPOTIFY_CLIENT_SECRET

client_id     = process.env.SPOTIFY_CLIENT_ID
client_secret = process.env.SPOTIFY_CLIENT_SECRET
http_port     = process.env.PORT || 3000
stateKey      = 'spotify_auth_state'

app = express()
app.set('views', path.resolve(path.join(__dirname, "../../views/")))
app.set('view engine', 'jade')
app.disable('x-powered-by')

app.use(express.static("front"))
   .use(cookieParser())

server = app.listen(http_port, (err) ->
	if(err)
		console.log(err)
	else
		console.log("===== Serving on port " + http_port + " ======"))

redirect_uri  = 'http://localhost:#{http_port}/callback'

###
# Generates a random string containing numbers and letters
# param  {number} length The length of the string
# return {string} The generated string
###
generateRandomString = (length) ->
  text = ''
  _.times(length, -> text += randomAlphaNumeric())
  return text

randomAlphaNumeric = () ->
  possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  possible.charAt(Math.floor(Math.random() * possible.length))

envError = () ->
	console.log("SPOTIFY_CLIENT_ID='your_username'")
	console.log("SPOTIFY_CLIENT_SECRET='your_password'")
	process.exit(1)


###
# Route for the root project page
###
app.get('/', (req, res) ->
  res.render('index', { title: 'Project' }))

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

###
# Route to authenticate a Spotify user
###
app.get('/login', (req, res) ->
  state = generateRandomString(16)
  res.cookie(stateKey, state)

  # Request authorization
  scope = 'user-read-private user-read-email'
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }))
)

###
# Route that Spotify will hit after authentication
###
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
        res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }))
  )
)

app.get('/refresh_token', (req, res) ->
  # requesting access token from refresh token
  refresh_token = req.query.refresh_token
  authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' +
      (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true }

  request.post(authOptions, (error, response, body) ->
    if (!error && response.statusCode is 200)
      access_token = body.access_token
      res.send({ 'access_token': access_token })
  )
)
