(function() {
  "use strict";
  var SpotifyClient, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = window.configApp();

  SpotifyClient = (function() {
    var auth_header;

    function SpotifyClient() {
      this.render_playlists = bind(this.render_playlists, this);
      this.process_playlists = bind(this.process_playlists, this);
      this.recursive_get_tracks = bind(this.recursive_get_tracks, this);
      this.recursive_get_playlists = bind(this.recursive_get_playlists, this);
      this.get_users_playlists = bind(this.get_users_playlists, this);
      this.get_playlist_tracks = bind(this.get_playlist_tracks, this);
      this.playlist_tracks_url = bind(this.playlist_tracks_url, this);
      this.users_playlists_url = bind(this.users_playlists_url, this);
      this.config = {
        api_host: "https://api.spotify.com/v1"
      };
      this.access = get_access();
      this.refresh = get_refresh();
      this.user_id = get_user();
      this.user_playlists = [];
    }

    SpotifyClient.prototype.api_url = function(endpoint, qs_obj) {
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

    SpotifyClient.prototype.users_playlists_url = function(user_id, qs_obj) {
      if (qs_obj == null) {
        qs_obj = null;
      }
      return this.api_url(this.config.api_host + "/users/" + user_id + "/playlists", qs_obj);
    };

    SpotifyClient.prototype.playlist_tracks_url = function(user_id, playlist_id, qs_obj) {
      if (qs_obj == null) {
        qs_obj = null;
      }
      return this.api_url(this.config.api_host + "/users/" + user_id + "/playlists/" + playlist_id + "/tracks", qs_obj);
    };

    SpotifyClient.prototype.get_playlist_tracks = function(playlist_id) {
      var init_req;
      console.log(this.playlist_tracks_url(this.user_id, playlist_id, {
        limit: 100
      }));
      this.current_tracks = [];
      init_req = this.playlist_tracks_url(this.user_id, playlist_id, {
        limit: 100
      });
      return this.recursive_get_tracks(init_req);
    };

    SpotifyClient.prototype.get_users_playlists = function() {
      var init_req;
      init_req = this.users_playlists_url(this.user_id, {
        limit: 50
      });
      return this.recursive_get_playlists(init_req);
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
            console.log(res);
            if (res.next != null) {
              return _this.recursive_get_tracks(res.next);
            } else {
              return $(window).trigger('upm:tracksLoad');
            }
          };
        })(this)
      });
    };

    SpotifyClient.prototype.process_playlists = function(playlists_res) {
      var data;
      return data = _.chain(playlists_res).flatten().map(function(playlist) {
        return _.pick(playlist, 'name', 'id');
      }).value();
    };

    SpotifyClient.prototype.render_playlists = function(playlists_res) {
      return app.templates.user_playlists(this.process_playlists(playlists_res));
    };

    auth_header = function(access) {
      return {
        'Authorization': 'Bearer ' + access
      };
    };

    return SpotifyClient;

  })();

  app.SpotifyClient = SpotifyClient;

}).call(this);

//# sourceMappingURL=spotify_client.js.map
