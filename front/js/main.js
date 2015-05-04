(function() {
  "use strict";
  var app;

  app = window.configApp();

  window.onload = function() {
    app.spotify = new app.SpotifyClient();
    app.playlists_list = $("#js-playlists-list");
    app.playlist_table = $("#js-playlist-table");
    app.spotify.get_users_playlists();
    $(window).on('upm:playlistsLoad', function(e) {
      var content;
      content = app.spotify.render_playlists(app.spotify.user_playlists);
      console.log(content);
      return app.playlists_list.append(content);
    });
    return $(window).on('upm:tracksLoad', function(e) {});
  };

}).call(this);

//# sourceMappingURL=main.js.map
