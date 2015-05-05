(function() {
  "use strict";
  var app;

  app = window.config_app();

  window.onload = function() {
    app.$window = $(window);
    app.spotify = new app.SpotifyClient();
    app.dom_playlists = $("#js-playlists");
    app.dom_playlists_list = $("#js-playlists-list");
    app.dom_playlist = $("#js-playlist");
    app.dom_playlist_table = $("#js-playlist-table");
    app.$window.on('hashchange', app.page_load_logic);
    app.spotify.get_users_playlists();
    app.$window.on('upm:playlistsLoad', function(e) {
      var content;
      content = app.spotify.render_playlists(app.spotify.user_playlists);
      return app.show_list(content);
    });
    app.$window.on('upm:tracksLoad', function(e) {
      var data;
      return data = app.spotify.get_echo_track_data(app.spotify.current_tracks);
    });
    return app.$window.on('upm:echoLoad', function(e) {
      var content, data;
      data = app.spotify.merge_echo_spotify();
      content = app.spotify.render_playlist(data);
      console.log(data);
      return app.show_table(content);
    });
  };

  app.page_load_logic = function(e) {
    var playlist_id, ref, user_id;
    if (get_hash_bang() === "you") {
      return app.spotify.get_users_playlists();
    } else {
      ref = hash_to_user_and_playlist(), playlist_id = ref[0], user_id = ref[1];
      console.log(hash_to_user_and_playlist().length);
      console.log("Hash: ", playlist_id, user_id);
      return app.spotify.get_playlist_tracks(playlist_id, user_id);
    }
  };

  app.show_list = function(content) {
    app.dom_playlists_list.append(content);
    app.dom_playlist.addClass('hide');
    app.dom_playlists.removeClass('hide');
    return app.dom_playlist_table.empty();
  };

  app.show_table = function(content) {
    app.dom_playlist_table.append(content);
    app.dom_playlists.addClass('hide');
    app.dom_playlist.removeClass('hide');
    app.dom_playlists_list.empty();
    return app.dom_playlist_table.footable();
  };

}).call(this);

//# sourceMappingURL=main.js.map
