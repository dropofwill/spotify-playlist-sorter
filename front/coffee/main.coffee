"use strict"

app = window.config_app()

window.onload = ->
  app.$window = $(window)
  app.spotify = new app.SpotifyClient()
  app.dom_playlists      = $("#js-playlists")
  app.dom_playlists_list = $("#js-playlists-list")
  app.dom_playlist       = $("#js-playlist")
  app.dom_playlist_table = $("#js-playlist-table")

  app.spotify.get_users_playlists()

  app.$window.on('upm:playlistsLoad', (e) ->
    content = app.spotify.render_playlists(app.spotify.user_playlists)
    app.show_list(content)

    $('.js-playlist-link').on('click', (ev) ->
      # ev.preventDefault()
      console.log(ev.currentTarget.id)
    )
  )

  app.$window.on('upm:tracksLoad', (e) ->
    data = app.spotify.get_echo_track_data(app.spotify.current_tracks)
  )

  app.$window.on('upm:echoLoad', (e) ->
    # console.log(app.spotify.spotify_tracks)
    # console.log(app.spotify.echo_tracks)
    data = app.spotify.merge_echo_spotify()
    content = app.spotify.render_playlist(data)
    app.show_table(content)
  )

  app.$window.on('hashchange', app.page_load_logic)

app.page_load_logic = (e) ->
  if get_hash_bang() is "you"
    app.spotify.get_users_playlists()
  else
    [playlist_id, user_id] = hash_to_user_and_playlist()
    console.log(hash_to_user_and_playlist().length)
    console.log(get_hash_bang())
    console.log("Hash: ", playlist_id, user_id)
    app.spotify.get_playlist_tracks(playlist_id, user_id)

app.show_list = (content) ->
  app.dom_playlists_list.append(content)
  app.dom_playlist.addClass('hide')
  app.dom_playlists.removeClass('hide')
  app.dom_playlist_table.empty()

app.show_table = (content) ->
  app.dom_playlist_table.append(content)
  app.dom_playlists.addClass('hide')
  app.dom_playlist.removeClass('hide')
  app.dom_playlists_list.empty()
