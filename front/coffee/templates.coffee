"use strict"

app = window.configApp()

templates = {}

templates.user_playlists = _.template('''
  <% _.forEach(data, function(playlist) { %>
    <li>
      <a href="playlists/#!<%= playlist.id %>"><%= playlist.name %></a>
    </li>
  <% }); %>
''', {variable: 'data'})

templates.track = _.template('''
  <tr>
    <td><%= track.name %></td>
  </tr>
''', {variable: 'track'})

app.templates = templates
