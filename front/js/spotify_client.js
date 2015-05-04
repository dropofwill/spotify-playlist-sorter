(function() {
  "use strict";
  var SpotifyClient, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = window.config_app();

  SpotifyClient = (function() {
    var api_url, auth_header, process_playlist, process_playlists;

    function SpotifyClient() {
      this.recursive_get_tracks = bind(this.recursive_get_tracks, this);
      this.recursive_get_playlists = bind(this.recursive_get_playlists, this);
      this.playlist_tracks_url = bind(this.playlist_tracks_url, this);
      this.render_playlists = bind(this.render_playlists, this);
      this.get_echo_track_data = bind(this.get_echo_track_data, this);
      this.get_playlist_tracks = bind(this.get_playlist_tracks, this);
      this.get_users_playlists = bind(this.get_users_playlists, this);
      this.spotify_api_host = "https://api.spotify.com/v1";
      this.echo_api_host = "https://developer.echonest.com/api/v4";
      this.access = get_access();
      this.refresh = get_refresh();
      this.user_id = get_user();
      this.user_playlists = [];
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
        limit: 100
      });
      return this.recursive_get_tracks(init_req);
    };

    SpotifyClient.prototype.get_echo_track_data = function(spotify_playlist_res) {
      return console.log(spotify_playlist_res);
    };

    SpotifyClient.prototype.render_playlists = function(playlists_res) {
      return app.templates.user_playlists(process_playlists(playlists_res));
    };

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

    SpotifyClient.prototype.recursive_get_playlists = function(req_url) {
      return $.ajax({
        url: req_url,
        headers: auth_header(this.access),
        success: (function(_this) {
          return function(res) {
            _this.user_playlists.push(res.items);
            if (res.next != null) {
              return _this.recursive_get_playlists(res.next);
            } else {
              return $(window).trigger('upm:playlistsLoad');
            }
          };
        })(this)
      });
    };

    SpotifyClient.prototype.recursive_get_tracks = function(req_url) {
      return $.ajax({
        url: req_url,
        headers: auth_header(this.access),
        success: (function(_this) {
          return function(res) {
            _this.current_tracks.push(res.items);
            if (res.next != null) {
              return _this.recursive_get_tracks(res.next);
            } else {
              return $(window).trigger('upm:tracksLoad');
            }
          };
        })(this)
      });
    };

    process_playlists = function(playlists_res) {
      var data;
      return data = _.chain(playlists_res).flatten().map(function(playlist) {
        return _.pick(playlist, 'name', 'id', 'owner');
      }).value();
    };

    process_playlist = function(playlists_res) {};


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
