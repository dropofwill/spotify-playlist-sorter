spotify = exports
qs   = require('querystring')
url  = require('url')

config = require('./config')

###
# Returns a URL string for phase 1 of the OAuth 2 process
# Requires a string state parameter
# Optionally pass a string host, string path, or array of scopes
###
spotify.auth_builder = (state, host=config.accounts_host, path=config.auth_path,
                      scopes=['user-read-private', 'user-read-email']) ->
  scope = scopes.join(" ")

  url.format(
    protocol: 'https'
    hostname: host
    pathname: path
    query:
      response_type:  'code'
      client_id:      config.client_id
      redirect_uri:   config.redirect_uri
      state:          state
      scope:          scope)


spotify.build_token_req = () ->

spotify.build_query_req = () ->
