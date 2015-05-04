"use strict"

app = window.config_app()

class SpotifyClient

  constructor: () ->
    @config  =
      api_host: "https://api.spotify.com/v1"

    @access  = get_access()
    @refresh = get_refresh()
    @user_id = get_user()
    @user_playlists = []

  ###
  # Retrieve all of the logged in users' playlists, making multiple requests as
  # necessary.
  # Triggers the 'upm:playlistLoad' event when finished
  ###
  get_users_playlists: () =>
    init_req = @users_playlists_url(@user_id, limit: 50)
    @recursive_get_playlists(init_req)

  ###
  # Retrieve all of the tracks from a given playlists, making multiple
  # requests as necessary. If the playlist isn't owned by the current logged in
  # user the owners id is required as a parameter,
  # Triggers the 'upm:tracksLoad' event when finished
  ###
  get_playlist_tracks: (playlist_id, uid=@user_id) =>
    @current_tracks = []
    init_req = @playlist_tracks_url(uid, playlist_id, limit: 100)
    @recursive_get_tracks(init_req)

  render_playlists: (playlists_res) =>
    app.templates.user_playlists(process_playlists(playlists_res))

  users_playlists_url: (user_id, qs_obj=null) ->
    api_url("#{@config.api_host}/users/#{user_id}/playlists", qs_obj)

  playlist_tracks_url: (user_id, playlist_id, qs_obj=null) =>
    api_url(
      "#{@config.api_host}/users/#{user_id}/playlists/#{playlist_id}/tracks",
      qs_obj)

  recursive_get_playlists: (req_url) =>
    $.ajax(
        url: req_url
        headers: auth_header(@access)
        success: (res) =>
          @user_playlists.push(res.items)
          # console.log(@user_playlists)
          if res.next?
            @recursive_get_playlists(res.next)
          else
            $(window).trigger('upm:playlistsLoad'))

  recursive_get_tracks: (req_url) =>
    $.ajax(
      url: req_url
      headers: auth_header(@access)
      success: (res) =>
        # console.log(res)
        @current_tracks.push(res.items)
        if res.next?
          @recursive_get_tracks(res.next)
        else
          $(window).trigger('upm:tracksLoad'))

  process_playlists = (playlists_res) =>
    data = _.chain(playlists_res)
      .flatten()
      .map((playlist) -> _.pick(playlist, 'name', 'id', 'owner'))
      .value()

  process_playlist = (playlists_res) =>

  ###
  # Private helper method for encoding an OAuth 2.0 Bearer header
  ###
  auth_header = (access) => 'Authorization': 'Bearer ' + access

  ###
  # Private helper method for building an api endpoint call, with and optional
  # query string object
  ###
  api_url = (endpoint, qs_obj=null) ->
    if qs_obj?
      qs = Url.stringify(qs_obj)
      endpoint = "#{endpoint}?#{qs}"
    endpoint

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
