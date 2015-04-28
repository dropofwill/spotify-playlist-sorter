$ = require('jquery')
_ = require('lodash')
utils = require('./utils.coffee')

console.log(_)


# userProfileSource = document.getElementById('user-profile-template').innerHTML
# userProfileTemplate = Handlebars.compile(userProfileSource)
# userProfilePlaceholder = document.getElementById('user-profile')
#
# oauthSource = document.getElementById('oauth-template').innerHTML
# oauthTemplate = Handlebars.compile(oauthSource)
# oauthPlaceholder = document.getElementById('oauth')

params = utils.getHashParams()

console.log(utils.getHashParams())
console.log(utils.getHashPairs())

# access_token = params.access_token
# refresh_token = params.refresh_token
# error = params.error
#
# if (error)
#   alert('There was an error during the authentication')
# else
#   if (access_token)
#     # render oauth info
#     oauthPlaceholder.innerHTML = oauthTemplate({
#       access_token: access_token,
#       refresh_token: refresh_token
#     })
#
#     $.ajax({
#         url: 'https://api.spotify.com/v1/me',
#         headers: { 'Authorization': 'Bearer ' + access_token },
#         success: (response) ->
#           userProfilePlaceholder.innerHTML = userProfileTemplate(response)
#
#           $('#login').hide()
#           $('#loggedin').show() })
#   else
#       # render initial screen
#       $('#login').show()
#       $('#loggedin').hide()
#
#   document.getElementById('obtain-new-token')
#     .addEventListener('click', ->
#     $.ajax({
#       url: '/refresh_token',
#       data: { 'refresh_token': refresh_token }
#     })
#     .done((data) ->
#       access_token = data.access_token
#       oauthPlaceholder.innerHTML = oauthTemplate({
#         access_token: access_token,
#         refresh_token: refresh_token
#       })), false)
