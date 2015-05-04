(function() {
  "use strict";
  var app, templates;

  app = window.configApp();

  templates = {};

  templates.user_playlists = _.template('<% _.forEach(data, function(playlist) { %>\n  <li>\n    <a href="playlists/#!<%= playlist.id %>"><%= playlist.name %></a>\n  </li>\n<% }); %>', {
    variable: 'data'
  });

  templates.track = _.template('<tr>\n  <td><%= track.name %></td>\n</tr>', {
    variable: 'track'
  });

  app.templates = templates;

}).call(this);

//# sourceMappingURL=templates.js.map
