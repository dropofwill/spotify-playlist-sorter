(function() {
  "use strict";
  var app;

  app = window.configApp();

  window.onload = function() {
    return app.spotify = new app.SpotifyClient();
  };

}).call(this);

//# sourceMappingURL=main.js.map
