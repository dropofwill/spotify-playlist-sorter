"use strict"

app = window.configApp()

templates = {}

templates.user_playlists = _.template('''
  <ul>
    <% _.forEach(data.playlists, function(playlist) { %>
      <li><%= playlist.name %></li>
    <% }); %>
  </ul>
''', {variable: 'data'})

app.templates = templates
