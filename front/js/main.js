(function() {
  "use strict";
  var app;

  app = window.config_app();

  window.onload = function() {
    app.$window = $(window);
    app.spotify = new app.SpotifyClient();
    app.playlists_list = $("#js-playlists-list");
    app.playlist_table = $("#js-playlist-table");
    app.spotify.get_users_playlists();
    app.$window.on('upm:playlistsLoad', function(e) {
      var content;
      content = app.spotify.render_playlists(app.spotify.user_playlists);
      app.playlists_list.append(content);
      return $('.js-playlist-link').on('click', function(ev) {
        return console.log(ev.currentTarget.id);
      });
    });
    app.$window.on('upm:tracksLoad', function(e) {
      return console.log(app.spotify.current_tracks);
    });
    return app.$window.on('hashchange', app.page_load_logic);
  };

  app.page_load_logic = function(e) {
    var playlist_id, ref, user_id;
    ref = hash_to_user_and_playlist(), playlist_id = ref[0], user_id = ref[1];
    console.log("Hash: ", playlist_id, user_id);
    return app.spotify.get_playlist_tracks(playlist_id, user_id);
  };

}).call(this);

//# sourceMappingURL=main.js.map
