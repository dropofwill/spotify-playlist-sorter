(function() {
  "use strict";
  var SpotifyClient, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = window.config_app();

  SpotifyClient = (function() {
    var api_url, auth_header, process_playlists, reduce_spotify_tracks;

    function SpotifyClient() {
      this.merge_echo_spotify = bind(this.merge_echo_spotify, this);
      this.post_tracks_to_playlist = bind(this.post_tracks_to_playlist, this);
      this.post_create_playlist = bind(this.post_create_playlist, this);
      this.recursive_get_tracks = bind(this.recursive_get_tracks, this);
      this.recursive_get_playlists = bind(this.recursive_get_playlists, this);
      this.get_echo_audio_summary = bind(this.get_echo_audio_summary, this);
      this.add_playlist_url = bind(this.add_playlist_url, this);
      this.create_playlist_url = bind(this.create_playlist_url, this);
      this.playlist_tracks_url = bind(this.playlist_tracks_url, this);
      this.echo_tracks_url = bind(this.echo_tracks_url, this);
      this.render_playlist = bind(this.render_playlist, this);
      this.render_playlists = bind(this.render_playlists, this);
      this.get_echo_track_data = bind(this.get_echo_track_data, this);
      this.create_playlist = bind(this.create_playlist, this);
      this.get_playlist_tracks = bind(this.get_playlist_tracks, this);
      this.get_users_playlists = bind(this.get_users_playlists, this);
      this.spotify_api_host = "https://api.spotify.com/v1";
      this.echo_api_host = "https://developer.echonest.com/api/v4";
      this.max_playlist_size = 2;
      this.access = get_access();
      this.echo_key = get_echo();
      this.refresh = get_refresh();
      this.user_id = get_user();
      this.user_playlists = [];
      this.echo_tracks = [];
      this.spotify_tracks = [];
      this.track_ids = [];
      this.key_list = ["C", "C&#x266F;", "D", "E&#x266d;", "E", "F", "F&#x266F;", "G", "A&#x266d;", "A", "B&#x266d;", "B"];
      this.mode_list = ["Min.", "Maj."];
    }


    /*
     * Retrieve all of the logged in users' playlists, making multiple requests as
     * necessary.
     * Triggers the 'upm:playlistLoad' event when finished
     */

    SpotifyClient.prototype.get_users_playlists = function() {
      var init_req;
      init_req = this.users_playlists_url(this.user_id, {
        limit: 50
      });
      return this.recursive_get_playlists(init_req);
    };


    /*
     * Retrieve all of the tracks from a given playlists, making multiple
     * requests as necessary. If the playlist isn't owned by the current logged in
     * user the owners id is required as a parameter,
     * Triggers the 'upm:tracksLoad' event when finished
     */

    SpotifyClient.prototype.get_playlist_tracks = function(playlist_id, uid) {
      var init_req;
      if (uid == null) {
        uid = this.user_id;
      }
      this.current_tracks = [];
      init_req = this.playlist_tracks_url(uid, playlist_id, {
        limit: 75
      });
      return this.recursive_get_tracks(init_req);
    };


    /*
     * Creates a playlist and upon completion add the current tracks to it
     * Currently throwing a 403 despite correct user scopes, may be a bug in the
     * Spotify API
     */

    SpotifyClient.prototype.create_playlist = function(playlist_id) {
      var create_url, track_ids;
      create_url = this.create_playlist_url();
      track_ids = _.map($('#js-playlist-table tbody tr'), function(el) {
        return $(el).attr("id");
      });
      return this.post_create_playlist(create_url, playlist_id, (function(_this) {
        return function(res) {
          var tracks_url;
          tracks_url = _this.add_playlist_url(res.id);
          return _this.post_tracks_to_playlist(tracks_url, track_ids);
        };
      })(this));
    };

    SpotifyClient.prototype.logger = function(res) {
      return console.log(res, this.current_tracks);
    };


    /*
     * Reduce the spotify response to just an array of track objects
     * Extract just the track_ids
     * Make an ajax request to echonest for the meta data
     * Triggers the 'upm:echoLoad' event when finished
     */

    SpotifyClient.prototype.get_echo_track_data = function(spotify_playlist_res) {
      this.spotify_tracks = reduce_spotify_tracks(spotify_playlist_res);
      this.track_ids = _.pluck(this.spotify_tracks, 'uri');
      return this.get_echo_audio_summary(this.echo_tracks_url(this.track_ids));
    };


    /*
     * Takes an array of track objects and returns an array of track uris
     */

    SpotifyClient.prototype.pluck_ids = function(tracks) {
      return _.pluck(tracks, 'uri');
    };


    /*
     * Takes a parsed response and renders a lodash template of html
     */

    SpotifyClient.prototype.render_playlists = function(playlists_res) {
      return app.templates.user_playlists(process_playlists(playlists_res));
    };


    /*
     * Takes a parsed response and renders a lodash template of html
     */

    SpotifyClient.prototype.render_playlist = function(playlist_res) {
      var data;
      data = {};
      data.head = app.templates.track_head();
      data.body = _.reduce(playlist_res, function(template, track) {
        return template + "\n" + app.templates.track(track);
      });
      return app.templates.table_shell(data);
    };


    /*
     * Can't stringify track_ids because they would be duplicate hash keys
    #
     * http://developer.echonest.com/api/v4/song/profile?api_key=DDP9J5HAUE4JGKHOS&format=json&track_id=spotify:track:3L7BcXHCG8uT92viO6Tikl&track_id=spotify:track:4sgd8Oe36YeA1YpCzPBjiC&bucket=audio_summary
     */

    SpotifyClient.prototype.echo_tracks_url = function(track_ids) {
      var base, tracks_qs;
      base = {
        api_key: this.echo_key,
        format: 'json',
        bucket: 'audio_summary'
      };
      tracks_qs = "&track_id=" + (track_ids.join("&track_id="));
      return api_url(this.echo_api_host + "/song/profile", base) + tracks_qs;
    };


    /*
     * Generate the urls for each of the API requests
     */

    SpotifyClient.prototype.users_playlists_url = function(user_id, qs_obj) {
      if (qs_obj == null) {
        qs_obj = null;
      }
      return api_url(this.spotify_api_host + "/users/" + user_id + "/playlists", qs_obj);
    };

    SpotifyClient.prototype.playlist_tracks_url = function(user_id, playlist_id, qs_obj) {
      if (qs_obj == null) {
        qs_obj = null;
      }
      return api_url(this.spotify_api_host + "/users/" + user_id + "/playlists/" + playlist_id + "/tracks", qs_obj);
    };

    SpotifyClient.prototype.create_playlist_url = function() {
      return api_url(this.spotify_api_host + "/users/" + this.user_id + "/playlists");
    };

    SpotifyClient.prototype.add_playlist_url = function(playlist_id) {
      return api_url(this.spotify_api_host + "/users/" + this.user_id + "/playlists/" + playlist_id + "/tracks");
    };


    /*
     * Get audio summary data from the Echonest API
     */

    SpotifyClient.prototype.get_echo_audio_summary = function(req_url) {
      return $.ajax({
        url: req_url,
        success: (function(_this) {
          return function(res) {
            _this.echo_tracks = res.response.songs;
            return $(window).trigger('upm:echoLoad');
          };
        })(this)
      });
    };


    /*
     * As long as there is another page of playlists and we aren't at our limit
     * make another request.
     * Save the result in an instance variable this.user_playlists
     * When its done fire the custom event 'upm:playlistsLoad'
     */

    SpotifyClient.prototype.recursive_get_playlists = function(req_url) {
      return $.ajax({
        url: req_url,
        headers: auth_header(this.access),
        success: (function(_this) {
          return function(res) {
            _this.user_playlists.push(res.items);
            if ((res.next != null) && _this.user_playlists.length < _this.max_iterations) {
              return _this.recursive_get_playlists(res.next);
            } else {
              return $(window).trigger('upm:playlistsLoad');
            }
          };
        })(this)
      });
    };


    /*
     * As long as there is another page of tracks and we aren't at our limit
     * make another request.
     * Save the result in an instance variable this.current_tracks
     * When its done fire the custom event 'upm:tracksLoad'
     */

    SpotifyClient.prototype.recursive_get_tracks = function(req_url) {
      return $.ajax({
        url: req_url,
        headers: auth_header(this.access),
        success: (function(_this) {
          return function(res) {
            _this.current_tracks.push(res.items);
            if ((res.next != null) && _this.user_playlists.length < _this.max_iterations) {
              return _this.recursive_get_tracks(res.next);
            } else {
              return $(window).trigger('upm:tracksLoad');
            }
          };
        })(this)
      });
    };


    /*
     * Post request to create a new *empty* playlist of the given name
     * Takes a callback function that fires on completion since you probably
     * want to add some tracks.
     */

    SpotifyClient.prototype.post_create_playlist = function(req_url, name, callback) {
      return $.ajax({
        url: req_url,
        method: 'POST',
        data: JSON.stringify({
          "name": name,
          "public": true
        }),
        contentType: 'application/json',
        dataType: 'json',
        headers: auth_header(this.access),
        success: (function(_this) {
          return function(res) {
            return callback(res);
          };
        })(this)
      });
    };


    /*
     * Post request to create add a list of tracks (based on the spotify uri)
     * to a given playlist
     */

    SpotifyClient.prototype.post_tracks_to_playlist = function(req_url, list_of_ids) {
      return $.ajax({
        url: req_url,
        method: 'POST',
        data: JSON.stringify({
          "uris": list_of_ids
        }),
        contentType: 'application/json',
        dataType: 'json',
        headers: {
          'Authorization': 'Bearer ' + this.access
        },
        succes: (function(_this) {
          return function(res) {
            return console.log("Added tracks");
          };
        })(this)
      });
    };


    /*
     * Parse the json response to only have objects with the name, id, and owner
     * attributes to be passed to the view
     */

    process_playlists = function(playlists_res) {
      var data;
      return data = _.chain(playlists_res).flatten().map(function(playlist) {
        return _.pick(playlist, 'name', 'id', 'owner');
      }).value();
    };


    /*
     * Parse the json response to only have the track objects
     */

    reduce_spotify_tracks = function(playlist_res) {
      return _.chain(playlist_res).flatten().map(function(track) {
        return _.get(track, 'track');
      }).value();
    };


    /*
     * Merge responses from echonest and spotify and convert data into a more
     * human-readable format for the data table.
     */

    SpotifyClient.prototype.merge_echo_spotify = function(spotify_t, echo_t) {
      var merged, self;
      if (spotify_t == null) {
        spotify_t = this.spotify_tracks;
      }
      if (echo_t == null) {
        echo_t = this.echo_tracks;
      }
      self = this;
      merged = _.merge(spotify_t, _.map(echo_t, function(track) {
        return _.get(track, 'audio_summary');
      }));
      return _.map(merged, function(o) {
        return _.forEach(o, function(v, k) {
          switch (k) {
            case 'key':
              return _.set(o, k, self.key_list[v]);
            case 'mode':
              return _.set(o, k, self.mode_list[v]);
            case 'artists':
              return _.set(o, k, _.get(_.first(v), 'name'));
            case 'duration':
              return _.set(o, k, seconds_to_s(v));
            case 'tempo':
              return _.set(o, k, parseInt(v));
            case 'valence':
            case 'energy':
            case 'danceability':
            case 'acousticness':
            case 'liveness':
              return _.set(o, k, decimal_to_per(v));
          }
        });
      });
    };


    /*
     * Private helper method for encoding an OAuth 2.0 Bearer header
     */

    auth_header = function(access) {
      return {
        'Authorization': 'Bearer ' + access
      };
    };


    /*
     * Private helper method for building an api endpoint call, with and optional
     * query string object
     */

    api_url = function(endpoint, qs_obj) {
      var qs;
      if (qs_obj == null) {
        qs_obj = null;
      }
      if (qs_obj != null) {
        qs = Url.stringify(qs_obj);
        endpoint = endpoint + "?" + qs;
      }
      return endpoint;
    };

    return SpotifyClient;

  })();

  app.SpotifyClient = SpotifyClient;

}).call(this);

//# sourceMappingURL=spotify_client.js.map
