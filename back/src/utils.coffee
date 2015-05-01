utils = exports
_  = require('lodash')
qs = require('querystring')

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
# Returns a string that comprises a base url with an object of query params
# concatenated with a divider, either a "?" for query strings or "#" for 
# passing info to the client
###
utils.compose_url = (base_url, query_obj, hash_or_query="?") ->
  query = qs.stringify(query_obj)
  return "#{base_url}#{hash_or_query}#{query}"

utils.url_builder = (pathname, o = {}) ->
  o.protocol ?= 'https'
  o.hostname ?=  config.api_host
  o.hash     ?=  null

  o.response_type ?= 'code'
  o.client_id     ?= config.client_id
  o.redirect_uri  ?= config.redirect_uri
  o.state         ?= null
  o.scope         ?= 'user-read-private user-read-email'

  protocol: o.protocol
  hostname: o.hostname
  hash:     o.hash
  query:
    response_type: o.response_type
    client_id:     o.client_id
    redirect_uri:  o.redirect_uri
    state:         o.state
    scope:         o.scope

utils.auth_builder = (state, host=config.accounts_host, path=config.auth_path,
                      scopes=['user-read-private', 'user-read-email']) ->
  scope = scopes.join(" ")

  protocol: 'https'
  hostname: host
  pathname: path
  query:
    response_type:  'code'
    client_id:      config.client_id
    redirect_uri:   config.redirect_uri
    state:          state
    scope:          scope

