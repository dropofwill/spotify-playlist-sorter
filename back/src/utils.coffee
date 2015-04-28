utils = exports

_ = require('lodash')

###
# Returns a random alpha-numeric character
###
utils.randomAlphaNumeric = ->
  possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  possible.charAt(Math.floor(Math.random() * possible.length))

###
# Generates a random string containing numbers and letters
# param  {number} length The length of the string
# return {string} The generated string
###
utils.generateRandomString = (length) ->
  text = ''
  _.times(length, -> text += utils.randomAlphaNumeric())
  return text

utils.envError = ->
  console.log("Please add: \n
    SPOTIFY_CLIENT_ID='your_client_id' \n
    SPOTIFY_CLIENT_SECRET='your_secret' ")
  process.exit(1)

utils.logServer = (port, err) ->
  if(err)
    console.log(err)
  else
    console.log("===== Serving on port " + port + " ======")