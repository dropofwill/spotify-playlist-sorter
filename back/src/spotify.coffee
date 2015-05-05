spotify = exports
qs      = require('querystring')
url     = require('url')

config  = require('./config')
utils   = require('./utils')

###
# Returns a URL string for phase 1 of the OAuth 2 process
# Requires a string state parameter
# Optionally pass a string host, string path, or array of scopes
###
spotify.auth_builder = (state, host=config.accounts_host,
                        path=config.auth_path, scopes=config.scopes) ->
  scope = scopes.join(" ")
  console.log(scope)

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

###
# Returns an options object for a post request to either retrieve an access
# token (default) or refresh the current one (by passing in 'refresh_token' to
# the grant param.
###
spotify.token_builder = (code, grant='authorization_code',
                         host=config.accounts_host, path=config.token_path) ->
  url_str = url.format(protocol: 'https', hostname: host, pathname: path)

  if grant is 'authorization_code'
    form = {grant_type: grant, code: code, redirect_uri: config.redirect_uri}
  else
    form = {grant_type: grant, refresh_token: refresh_token }

  url: url_str
  form: form
  headers:
    'Authorization': utils.basic_auth_header()
  json: true

###
# Returns an options object for a post request to a previously created spotify
# endpoint that is passed in as the first parameter. The endpoint should start
# with a / and include everything after the version number (set in config)
###
spotify.query_builder = (endpoint, access_token, query_obj=null,
                         host=config.api_host, path=config.api_path) ->
  if query_obj?
    url_str = url.format(
      protocol: 'https'
      hostname: host
      pathname: path + endpoint
      query:    query_obj)
  else
    url_str = url.format(
      protocol: 'https'
      hostname: host
      pathname: path + endpoint)

  url: url_str
  headers:
    'Authorization': 'Bearer ' + access_token
  json: true

###
# Returns an options object for a post request to retrieve info about the
# currently logged in user.
###
spotify.get_me_builder = (access_token, host=config.api_host,
                          path=config.api_path) ->
  spotify.query_builder("/me", access_token)

###
# Returns an options object for a request to retrieve all the
# user's playlists
###
spotify.get_user_playlists_opts = (access_token, id, offset=null, limit=null
                                host=config.api_host, path=config.api_path) ->
  spotify.query_builder("/users/#{id}/playlists", access_token)

###
# Returns an options object for a request to retrieve a single playlist
###
spotify.get_a_playlist_opts = (access_token, user_id, playlist_id,
                               offset=null, limit=null
                               host=config.api_host, path=config.api_path) ->
  spotify.query_builder("/users/#{id}/playlists", access_token)
