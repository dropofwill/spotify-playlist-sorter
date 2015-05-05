"use strict"

app = window.config_app()

window.onload = ->
  app.$window = $(window)
  app.spotify = new app.SpotifyClient()
  app.dom_playlists      = $("#js-playlists")
  app.dom_playlists_list = $("#js-playlists-list")
  app.dom_playlist       = $("#js-playlist")
  app.dom_playlist_table = $("#js-playlist-table")

  app.dom_playlist_save        = $("#js-save-playlist")
  app.dom_playlist_save_name   = $("#js-save-playlist-name")
  app.dom_playlist_save_submit = $("#js-save-playlist-submit")
  app.dom_ajax                 = $(".ajax")

  app.$window.on('hashchange', app.page_load_logic)
  app.page_load_logic()

  app.$window.on('upm:playlistsLoad', (e) ->
    content = app.spotify.render_playlists(app.spotify.user_playlists)
    app.show_list(content)
  )

  app.$window.on('upm:tracksLoad', (e) ->
    app.spotify.get_echo_track_data(app.spotify.current_tracks)
  )

  app.$window.on('upm:echoLoad', (e) ->
    data = app.spotify.merge_echo_spotify()
    content = app.spotify.render_playlist(data)
    console.log(data)
    app.show_table(content)
  )

  app.dom_playlist_save_submit.on("click", (e) ->
    e.preventDefault()
    # console.log(app.dom_playlist_save_name.attr("value"))
    name = app.dom_playlist_save_name.attr("value")
    app.spotify.create_playlist(name)
  )

###
# Decide which view to load based on the hashbang url
###
app.page_load_logic = ->
  app.dom_ajax.removeClass("hide")
  if app.should_show_playlist()
    [playlist_id, user_id] = hash_to_user_and_playlist()
    app.spotify.get_playlist_tracks(playlist_id, user_id)
  else if app.should_create_playlist()
  else
    app.spotify.get_users_playlists()

###
# Check if the hash bang is of the form "playlist_id|user_id"
###
app.should_show_playlist = ->
  if hash_to_user_and_playlist()?.length is 2 then true else false

###
# Check if the hash bang is for showing playlist
###
app.should_show_playlists = ->
  if get_hash_bang() is "you" then true else false

app.should_create_playlist = ->
  if get_hash_bang() is "new" then true else false

###
# Loads the 'page' for selecting a playlist, after the data has been collected
###
app.show_list = (content) ->
  app.dom_ajax.addClass("hide")
  app.dom_playlists_list.append(content)
  app.dom_playlist.addClass('hide')
  app.dom_playlists.removeClass('hide')
  app.dom_playlist_table.empty()

###
# Loads the 'page' for interacting with a playlist, after the data has
# been collected
###
app.show_table = (content) ->
  app.dom_ajax.addClass("hide")
  app.dom_playlist_table.append(content)
  app.dom_playlists.addClass('hide')
  app.dom_playlist.removeClass('hide')
  app.dom_playlists_list.empty()
  app.dom_playlist_table.footable()

  app.dom_playlist_save_name.attr("value", "upm#{_.now()}")
