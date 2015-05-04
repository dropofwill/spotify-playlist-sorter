"use strict"

app = window.configApp()

window.onload = ->
  app.spotify = new app.SpotifyClient()
