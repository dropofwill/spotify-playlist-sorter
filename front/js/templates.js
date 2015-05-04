(function() {
  "use strict";
  var app, templates;

  app = window.config_app();

  templates = {};

  templates.user_playlists = _.template('<% _.forEach(data, function(playlist) { %>\n  <li>\n    <a href="#!<%= playlist.id %>|<%= playlist.owner.id %>" id="<%= playlist.id %>" class="js-playlist-link">\n      <%= playlist.name %>\n    </a>\n  </li>\n<% }); %>', {
    variable: 'data'
  });

  templates.track = _.template('<tr>\n  <td><%= track.name %></td>\n</tr>', {
    variable: 'track'
  });

  app.templates = templates;

}).call(this);

//# sourceMappingURL=templates.js.map
