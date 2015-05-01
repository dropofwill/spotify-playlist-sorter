spotify = exports
qs   = require('querystring')
url  = require('url')

config = require('./config')
utils = require('./utils')

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


spotify.token_builder = (code, host=config.accounts_host,
                         path=config.token_path) ->
  url_str = url.format(
    protocol: 'https'
    hostname: host
    pathname: path)

  url: url_str
  form:
    code: code
    redirect_uri: config.redirect_uri
    grant_type: 'authorization_code'
  headers:
    'Authorization': utils.basic_auth_header()
  json: true

spotify.query_builder = () ->
