"use strict"

app = window.config_app()

class SpotifyClient

  constructor: ->
    @spotify_api_host = "https://api.spotify.com/v1"
    @echo_api_host    = "https://developer.echonest.com/api/v4"
    # echonest rate limiting is annoying
    @max_playlist_size = 2

    @access   = get_access()
    @echo_key = get_echo()
    @refresh  = get_refresh()
    @user_id  = get_user()
    @user_playlists = []
    @echo_tracks = []
    @spotify_tracks = []
    @track_ids = []

    @key_list = [ "C", "C&#x266F;", "D", "E&#x266d;", "E", "F", "F&#x266F;",
                  "G", "A&#x266d;", "A", "B&#x266d;", "B"]
    @mode_list = [ "Min.", "Maj." ]

  ###
  # Retrieve all of the logged in users' playlists, making multiple requests as
  # necessary.
  # Triggers the 'upm:playlistLoad' event when finished
  ###
  get_users_playlists: =>
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
    init_req = @playlist_tracks_url(uid, playlist_id, limit: 75)
    @recursive_get_tracks(init_req)

  ###
  # Creates a playlist and upon completion add the current tracks to it
  # Currently throwing a 403 despite correct user scopes, may be a bug in the
  # Spotify API
  ###
  create_playlist: (playlist_id) =>
    create_url = @create_playlist_url()
    track_ids = _.map($('#js-playlist-table tbody tr'), (el) ->
        $(el).attr("id"))

    @post_create_playlist(create_url, playlist_id, (res) =>
      tracks_url = @add_playlist_url(res.id)
      @post_tracks_to_playlist(tracks_url, track_ids)
    )

  logger: (res) -> console.log(res, @current_tracks)

  ###
  # Reduce the spotify response to just an array of track objects
  # Extract just the track_ids
  # Make an ajax request to echonest for the meta data
  # Triggers the 'upm:echoLoad' event when finished
  ###
  get_echo_track_data: (spotify_playlist_res) =>
    @spotify_tracks = reduce_spotify_tracks(spotify_playlist_res)
    @track_ids = _.pluck(@spotify_tracks, 'uri')
    @get_echo_audio_summary(@echo_tracks_url(@track_ids))

  ###
  # Takes an array of track objects and returns an array of track uris
  ###
  pluck_ids: (tracks) -> _.pluck(tracks, 'uri')

  ###
  # Takes a parsed response and renders a lodash template of html
  ###
  render_playlists: (playlists_res) =>
    app.templates.user_playlists(process_playlists(playlists_res))

  ###
  # Takes a parsed response and renders a lodash template of html
  ###
  render_playlist: (playlist_res) =>
    data = {}
    data.head = app.templates.track_head()
    data.body = _.reduce(playlist_res,
      (template, track) -> template + "\n" + app.templates.track(track))
    app.templates.table_shell(data)

  ###
  # Can't stringify track_ids because they would be duplicate hash keys
  #
  # http://developer.echonest.com/api/v4/song/profile?api_key=DDP9J5HAUE4JGKHOS&format=json&track_id=spotify:track:3L7BcXHCG8uT92viO6Tikl&track_id=spotify:track:4sgd8Oe36YeA1YpCzPBjiC&bucket=audio_summary
  ###
  echo_tracks_url: (track_ids) =>
    base =
      api_key: @echo_key
      format: 'json'
      bucket: 'audio_summary'
    tracks_qs = "&track_id=#{track_ids.join("&track_id=")}"
    api_url("#{@echo_api_host}/song/profile", base) + tracks_qs

  ###
  # Generate the urls for each of the API requests
  ###
  users_playlists_url: (user_id, qs_obj=null) ->
    api_url("#{@spotify_api_host}/users/#{user_id}/playlists", qs_obj)

  playlist_tracks_url: (user_id, playlist_id, qs_obj=null) =>
    api_url(
      "#{@spotify_api_host}/users/#{user_id}/playlists/#{playlist_id}/tracks",
      qs_obj)

  create_playlist_url: =>
    api_url("#{@spotify_api_host}/users/#{@user_id}/playlists")

  add_playlist_url: (playlist_id) =>
    api_url("#{@spotify_api_host}/users/#{@user_id}/playlists/#{playlist_id}/tracks")

  ###
  # Get audio summary data from the Echonest API
  ###
  get_echo_audio_summary: (req_url) =>
    $.ajax(
        url: req_url
        success: (res) =>
          @echo_tracks = res.response.songs
          $(window).trigger('upm:echoLoad'))

  ###
  # As long as there is another page of playlists and we aren't at our limit
  # make another request.
  # Save the result in an instance variable this.user_playlists
  # When its done fire the custom event 'upm:playlistsLoad'
  ###
  recursive_get_playlists: (req_url) =>
    $.ajax(
        url: req_url
        headers: auth_header(@access)
        success: (res) =>
          @user_playlists.push(res.items)
          if res.next? and @user_playlists.length < @max_iterations
            @recursive_get_playlists(res.next)
          else
            $(window).trigger('upm:playlistsLoad'))

  ###
  # As long as there is another page of tracks and we aren't at our limit
  # make another request.
  # Save the result in an instance variable this.current_tracks
  # When its done fire the custom event 'upm:tracksLoad'
  ###
  recursive_get_tracks: (req_url) =>
    $.ajax(
      url: req_url
      headers: auth_header(@access)
      success: (res) =>
        @current_tracks.push(res.items)
        if res.next? and @user_playlists.length < @max_iterations
          @recursive_get_tracks(res.next)
        else
          $(window).trigger('upm:tracksLoad'))

  ###
  # Post request to create a new *empty* playlist of the given name
  # Takes a callback function that fires on completion since you probably
  # want to add some tracks.
  ###
  post_create_playlist: (req_url, name, callback) =>
    $.ajax(
      url: req_url
      method: 'POST'
      data: JSON.stringify({"name": name, "public": true})
      contentType: 'application/json'
      dataType: 'json'
      headers: auth_header(@access)
      success: (res) => callback(res))

  ###
  # Post request to create add a list of tracks (based on the spotify uri)
  # to a given playlist
  ###
  post_tracks_to_playlist: (req_url, list_of_ids) =>
    $.ajax(
      url: req_url
      method: 'POST'
      data: JSON.stringify({"uris": list_of_ids})
      contentType: 'application/json'
      dataType: 'json'
      headers:
        'Authorization': 'Bearer ' + @access
      succes: (res) => console.log("Added tracks"))

  ###
  # Parse the json response to only have objects with the name, id, and owner
  # attributes to be passed to the view
  ###
  process_playlists = (playlists_res) =>
    data = _.chain(playlists_res)
      .flatten()
      .map((playlist) -> _.pick(playlist, 'name', 'id', 'owner'))
      .value()

  ###
  # Parse the json response to only have the track objects
  ###
  reduce_spotify_tracks = (playlist_res) ->
    _.chain(playlist_res)
        .flatten()
        .map((track) -> _.get(track, 'track'))
        .value()

  ###
  # Merge responses from echonest and spotify and convert data into a more
  # human-readable format for the data table.
  ###
  merge_echo_spotify: (spotify_t=@spotify_tracks, echo_t=@echo_tracks) =>
    self = this
    merged = _.merge(spotify_t,
      _.map(echo_t, (track) -> _.get(track, 'audio_summary')))

    _.map(merged, (o) ->
      _.forEach(o, (v,k) ->
        switch k
          when 'key'      then _.set(o, k, self.key_list[v])
          when 'mode'     then _.set(o, k, self.mode_list[v])
          when 'artists'  then _.set(o, k, _.get(_.first(v), 'name'))
          when 'duration' then _.set(o, k, seconds_to_s(v))
          when 'tempo'    then _.set(o, k, parseInt(v))
          when 'valence', 'energy', 'danceability', 'acousticness', 'liveness'
             _.set(o, k, decimal_to_per(v))
        )
      )

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
