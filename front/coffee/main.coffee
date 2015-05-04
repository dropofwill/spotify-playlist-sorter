"use strict"

app = window.configApp()

window.onload = ->
  app.spotify = new app.SpotifyClient()
  app.playlists_list = $("#js-playlists-list")
  app.playlist_table = $("#js-playlist-table")

  app.spotify.get_users_playlists()
  # app.spotify.get_playlist_tracks("6e1t5qYPvJwKC4VMAJRVVn")

  $(window).on('upm:playlistsLoad', (e) ->
    content = app.spotify.render_playlists(app.spotify.user_playlists)
    console.log(content)
    app.playlists_list.append(content))

  $(window).on('upm:tracksLoad', (e) -> )
