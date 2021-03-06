(function() {
  "use strict";
  var app, templates;

  app = window.config_app();

  templates = {};

  templates.user_playlists = _.template('<% _.forEach(data, function(playlist) { %>\n  <li>\n    <a href="#!<%= playlist.id %>|<%= playlist.owner.id %>" id="<%= playlist.id %>" class="js-playlist-link">\n      <%= playlist.name %>\n    </a>\n  </li>\n<% }); %>', {
    variable: 'data'
  });

  templates.table_shell = _.template('<thead>\n  <%= data.head %>\n</thead>\n<tbody>\n  <%= data.body %>\n</tbody>', {
    variable: 'data'
  });

  templates.track_head = _.template('<tr>\n  <th>Title</th>\n  <th>Artist</th>\n  <th>Dur.</th>\n  <th>BPM</th>\n  <th>Key</th>\n  <th>Mode</th>\n  <th>Sig.</th>\n  <th>Pop.</th>\n  <th>Val.</th>\n  <th>Energy</th>\n  <th>Dance</th>\n  <th>Acoustic</th>\n  <th>Live</th>\n</tr>');

  templates.track = _.template('<tr id="<%= track.uri %>">\n  <td><%= track.name %></td>\n  <td><%= track.artists %></td>\n  <td><%= track.duration %></td>\n  <td><%= track.tempo %></td>\n  <td><%= track.key %></td>\n  <td><%= track.mode %></td>\n  <td><%= track.time_signature %></td>\n  <td><%= track.popularity %></td>\n  <td><%= track.valence %></td>\n  <td><%= track.energy %></td>\n  <td><%= track.danceability %></td>\n  <td><%= track.acousticness %></td>\n  <td><%= track.liveness %></td>\n</tr>', {
    variable: 'track'
  });

  app.templates = templates;

}).call(this);

//# sourceMappingURL=templates.js.map
