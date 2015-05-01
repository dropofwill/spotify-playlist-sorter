#!/bin/env node

require('coffee-script/register')

# base libraries
express      = require('express')
request      = require('request')
querystring  = require('querystring')
cookieParser = require('cookie-parser')
path         = require('path')
fs           = require('fs')
rem          = require('rem')
_            = require('lodash')
# internal libraries
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
  key:    client_id
  secret: client_secret

app = express()
app.set('views', path.resolve(path.join(__dirname, "../../views/")))
   .set('view engine', 'jade')
   .disable('x-powered-by')
   .use(express.static("front"))
   .use(cookieParser())

server = app.listen(http_port, (err) -> utils.logServer(http_port, err))

spotify = rem.connect('api.spotify.com', 1.0).configure(creds)
oauth = rem.oauth(spotify, redirect_uri)

###
# Route for the root project page
###
app.get('/', (req, res) ->
  res.render('index', { title: 'Project' }))

app.use(oauth.middleware((req, res, next) ->
  console.log("authenticated")
  res.redirect('/')))

app.get('/login/', oauth.login())
app.get('/logout/', oauth.logout())
