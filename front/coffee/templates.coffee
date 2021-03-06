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

templates.table_shell = _.template('''
  <thead>
    <%= data.head %>
  </thead>
  <tbody>
    <%= data.body %>
  </tbody>
''', {variable: 'data'})

templates.track_head = _.template('''
  <tr>
    <th>Title</th>
    <th>Artist</th>
    <th>Dur.</th>
    <th>BPM</th>
    <th>Key</th>
    <th>Mode</th>
    <th>Sig.</th>
    <th>Pop.</th>
    <th>Val.</th>
    <th>Energy</th>
    <th>Dance</th>
    <th>Acoustic</th>
    <th>Live</th>
  </tr>
''')

templates.track = _.template('''
  <tr id="<%= track.uri %>">
    <td><%= track.name %></td>
    <td><%= track.artists %></td>
    <td><%= track.duration %></td>
    <td><%= track.tempo %></td>
    <td><%= track.key %></td>
    <td><%= track.mode %></td>
    <td><%= track.time_signature %></td>
    <td><%= track.popularity %></td>
    <td><%= track.valence %></td>
    <td><%= track.energy %></td>
    <td><%= track.danceability %></td>
    <td><%= track.acousticness %></td>
    <td><%= track.liveness %></td>
  </tr>
''', {variable: 'track'})

app.templates = templates
