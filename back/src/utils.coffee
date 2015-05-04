utils = exports
_     = require('lodash')
qs    = require('querystring')
url   = require('url')

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
# Basic building block for sending data to the client
###
utils.hash_builder = (qs_obj) -> "/##{qs.stringify(qs_obj)}"

utils.query_builder = (path, qs_obj) ->
  url.format(pathname: path, query: qs_obj)

###
# Simple, local error passed as a hash url to the client
###
utils.local_error_builder = (err_msg, ec="") ->
  console.warn("Warning: #{err_msg} #{ec}")
  utils.hash_builder(error: err_msg)

###
# Check whether the client after the request is the same as the client after
# Takes the callbacks request object and returns a boolean
###
utils.client_has_correct_state = (req) ->
  state = req.query.state ? null
  stored_state = req.cookies?[config.state_key] ? null

  if state? and state is stored_state then true else false

###
# Generate a base64 encoded buffer with the client id and secret divided by a :
# Used when requesting token generation
###
utils.basic_auth_header = () ->
  client_info = new Buffer("#{config.client_id}:#{config.client_secret}")
    .toString('base64')
  "Basic #{client_info}"

###
# Simple helper for checking whether a response was successful
###
utils.was_good_response = (err, res) ->
  if not err and 200 >= res.statusCode < 300 then true else false
