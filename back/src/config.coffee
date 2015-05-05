parse = require('url-parse')
url   = require('url')
path  = require('path')

###
# If these environment variable are not set, we cannot continue
# Throw a warning and kill the process
###

if (not process.env.SPOTIFY_CLIENT_ID     and
    not process.env.SPOTIFY_CLIENT_SECRET and
    not process.env.ECHO_API_KEY          and
    not process.env.UPM_REDIRECT_URI)
  utils.envError()

redirect_uri  = process.env.UPM_REDIRECT_URI
port          = process.env.PORT || parse(redirect_uri).port

module.exports =
  client_id:      process.env.SPOTIFY_CLIENT_ID
  client_secret:  process.env.SPOTIFY_CLIENT_SECRET
  echo_api_key:   process.env.ECHO_API_KEY
  redirect_uri:   redirect_uri
  port:           port

  views_dir:      path.resolve(path.join(__dirname, "../../views/"))
  view_engine:    'jade'

  state_key:     'spotify_auth_state'
  access_key:    'spotify_access_token'
  refresh_key:   'spotify_refresh_token'

  accounts_host:  'accounts.spotify.com'
  api_host:       'api.spotify.com'

  auth_path:      '/authorize'
  token_path:     '/api/token'
  api_path:       '/v1'

  scopes:         ['user-read-private', 'user-read-email',
                   'playlist-modify-public', 'playlist-modify-private',
                   'playlist-read-private']
