(function() {
  "use strict";
  var SpotifyClient, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = window.configApp();

  SpotifyClient = (function() {
    function SpotifyClient() {
      this.render_playlists = bind(this.render_playlists, this);
      this.get_users_playlists = bind(this.get_users_playlists, this);
      this.users_playlists_url = bind(this.users_playlists_url, this);
      this.auth_header = bind(this.auth_header, this);
      this.config = {
        api_host: "https://api.spotify.com/v1"
      };
      this.access = get_access();
      this.refresh = get_refresh();
      this.user_id = get_user();
      console.log(this.get_users_playlists());
    }

    SpotifyClient.prototype.auth_header = function(access) {
      if (access == null) {
        access = this.access;
      }
      return {
        'Authorization': 'Bearer ' + access
      };
    };

    SpotifyClient.prototype.users_playlists_url = function(user_id) {
      return this.api_host + "/users/" + user_id + "/playlists";
    };

    SpotifyClient.prototype.get_users_playlists = function() {
      return $.ajax({
        url: this.users_playlists_url(this.user_id),
        headers: this.auth_header(),
        success: function(res) {
          return console.log(res);
        }
      });
    };

    SpotifyClient.prototype.render_playlists = function(playlists_obj) {
      playlists_obj = {
        playlists: [
          {
            name: "yolo"
          }, {
            name: "swag"
          }
        ]
      };
      return app.templates.user_playlists();
    };

    return SpotifyClient;

  })();

  app.SpotifyClient = SpotifyClient;

}).call(this);

//# sourceMappingURL=spotify_client.js.map
