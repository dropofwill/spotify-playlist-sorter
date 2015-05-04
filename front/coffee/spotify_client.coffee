"use strict"

app = window.configApp()

class SpotifyClient

  constructor: () ->
    @config  =
      api_host: "https://api.spotify.com/v1"

    @access  = get_access()
    @refresh = get_refresh()
    @user_id = get_user()

    console.log(@get_users_playlists())

  auth_header: (access = @access) =>
    'Authorization': 'Bearer ' + access

  users_playlists_url: (user_id) =>
    "#{@api_host}/users/#{user_id}/playlists"

  get_users_playlists: () =>
    $.ajax(
        url: @users_playlists_url(@user_id)
        headers: @auth_header()
        success: (res) -> console.log(res))

  render_playlists: (playlists_obj) =>
    playlists_obj = {playlists: [{name: "yolo"}, {name: "swag"}]}
    app.templates.user_playlists()

app.SpotifyClient = SpotifyClient

# userProfileSource = document.getElementById('user-profile-template').innerHTML
# userProfileTemplate = Handlebars.compile(userProfileSource)
# userProfilePlaceholder = document.getElementById('user-profile')
#
# oauthSource = document.getElementById('oauth-template').innerHTML
# oauthTemplate = Handlebars.compile(oauthSource)
# oauthPlaceholder = document.getElementById('oauth')

# params = getHashParams()

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
