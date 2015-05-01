utils = exports
_    = require('lodash')
qs   = require('querystring')
url  = require('url')

config = require('./config')

###
# Returns a random alpha-numeric character
###
utils.random_alpha_numeric = ->
  possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  possible.charAt(Math.floor(Math.random() * possible.length))

###
# Generates a random string containing numbers and letters
# param  {number} length The length of the string
# return {string} The generated string
###
utils.generate_random_string = (length) ->
  text = ''
  _.times(length, -> text += utils.random_alpha_numeric())
  return text

###
# Warn user about missing environment variables
###
utils.env_error = ->
  console.log("Please add the following to your shell env: \n
    SPOTIFY_CLIENT_ID='your_client_id'  \n
    SPOTIFY_CLIENT_SECRET='your_secret' \n
    UPM_REDIRECT_URI='your_redirect_uri' \n
  ")
  process.exit(1)

###
# Give the console some nice feedback when starting the node server
###
utils.log_server = (port, err) ->
  if(err)
    console.log(err)
  else
    console.log("===== Serving on port " + port + " ======")


###
# Returns a URL string for phase 1 of the OAuth 2 process
# Requires a string state parameter
# Optionally pass a string host, string path, or array of scopes
###
utils.auth_builder = (state, host=config.accounts_host, path=config.auth_path,
                      scopes=['user-read-private', 'user-read-email']) ->
  scope = scopes.join(" ")

  url.format(
    protocol: 'https'
    hostname: host
    pathname: path
    query:
      response_type:  'code'
      client_id:      config.client_id
      redirect_uri:   config.redirect_uri
      state:          state
      scope:          scope)
