"use strict"

app = window.config_app()

window.onload = ->
  app.$window = $(window)
  app.spotify = new app.SpotifyClient()
  app.playlists_list = $("#js-playlists-list")
  app.playlist_table = $("#js-playlist-table")

  app.spotify.get_users_playlists()

  app.$window.on('upm:playlistsLoad', (e) ->
    content = app.spotify.render_playlists(app.spotify.user_playlists)
    app.playlists_list.append(content)
    # console.log($('.js-playlist-link'))

    $('.js-playlist-link').on('click', (ev) ->
      # ev.preventDefault()
      console.log(ev.currentTarget.id)))

  app.$window.on('upm:tracksLoad', (e) ->
    console.log(app.spotify.current_tracks)
    app.spotify.get_echo_track_data(app.spotify.current_tracks))

  app.$window.on('hashchange', app.page_load_logic)


app.page_load_logic = (e) ->
  [playlist_id, user_id] = hash_to_user_and_playlist()
  console.log("Hash: ", playlist_id, user_id)
  app.spotify.get_playlist_tracks(playlist_id, user_id)
