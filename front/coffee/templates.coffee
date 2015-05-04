"use strict"

app = window.config_app()

templates = {}

templates.user_playlists = _.template('''
  <% _.forEach(data, function(playlist) { %>
    <li>
      <a href="#!<%= playlist.id %>|<%= playlist.owner.id %>" id="<%= playlist.id %>" class="js-playlist-link">
        <%= playlist.name %>
      </a>
    </li>
  <% }); %>
''', {variable: 'data'})

templates.track = _.template('''
  <tr>
    <td><%= track.name %></td>
  </tr>
''', {variable: 'track'})

app.templates = templates
