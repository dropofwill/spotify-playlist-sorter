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
    app.dom_playlist_save = $("#js-save-playlist");
    app.dom_playlist_save_name = $("#js-save-playlist-name");
    app.dom_playlist_save_submit = $("#js-save-playlist-submit");
    app.dom_ajax = $(".ajax");
    app.$window.on('hashchange', app.page_load_logic);
    app.page_load_logic();
    app.$window.on('upm:playlistsLoad', function(e) {
      var content;
      content = app.spotify.render_playlists(app.spotify.user_playlists);
      return app.show_list(content);
    });
    app.$window.on('upm:tracksLoad', function(e) {
      return app.spotify.get_echo_track_data(app.spotify.current_tracks);
    });
    app.$window.on('upm:echoLoad', function(e) {
      var content, data;
      data = app.spotify.merge_echo_spotify();
      content = app.spotify.render_playlist(data);
      console.log(data);
      return app.show_table(content);
    });
    return app.dom_playlist_save_submit.on("click", function(e) {
      var name;
      e.preventDefault();
      name = app.dom_playlist_save_name.attr("value");
      return app.spotify.create_playlist(name);
    });
  };


  /*
   * Decide which view to load based on the hashbang url
   */

  app.page_load_logic = function() {
    var playlist_id, ref, user_id;
    app.dom_ajax.removeClass("hide");
    if (app.should_show_playlist()) {
      ref = hash_to_user_and_playlist(), playlist_id = ref[0], user_id = ref[1];
      return app.spotify.get_playlist_tracks(playlist_id, user_id);
    } else if (app.should_create_playlist()) {

    } else {
      return app.spotify.get_users_playlists();
    }
  };


  /*
   * Check if the hash bang is of the form "playlist_id|user_id"
   */

  app.should_show_playlist = function() {
    var ref;
    if (((ref = hash_to_user_and_playlist()) != null ? ref.length : void 0) === 2) {
      return true;
    } else {
      return false;
    }
  };


  /*
   * Check if the hash bang is for showing playlist
   */

  app.should_show_playlists = function() {
    if (get_hash_bang() === "you") {
      return true;
    } else {
      return false;
    }
  };

  app.should_create_playlist = function() {
    if (get_hash_bang() === "new") {
      return true;
    } else {
      return false;
    }
  };


  /*
   * Loads the 'page' for selecting a playlist, after the data has been collected
   */

  app.show_list = function(content) {
    app.dom_ajax.addClass("hide");
    app.dom_playlists_list.append(content);
    app.dom_playlist.addClass('hide');
    app.dom_playlists.removeClass('hide');
    return app.dom_playlist_table.empty();
  };


  /*
   * Loads the 'page' for interacting with a playlist, after the data has
   * been collected
   */

  app.show_table = function(content) {
    app.dom_ajax.addClass("hide");
    app.dom_playlist_table.append(content);
    app.dom_playlists.addClass('hide');
    app.dom_playlist.removeClass('hide');
    app.dom_playlists_list.empty();
    app.dom_playlist_table.footable();
    return app.dom_playlist_save_name.attr("value", "upm" + (_.now()));
  };

}).call(this);

//# sourceMappingURL=main.js.map
