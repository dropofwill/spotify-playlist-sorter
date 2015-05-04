(function() {
  "use strict";
  var app, templates;

  app = window.configApp();

  templates = {};

  templates.user_playlists = _.template('<ul>\n  <% _.forEach(data.playlists, function(playlist) { %>\n    <li><%= playlist.name %></li>\n  <% }); %>\n</ul>', {
    variable: 'data'
  });

  app.templates = templates;

}).call(this);

//# sourceMappingURL=templates.js.map
