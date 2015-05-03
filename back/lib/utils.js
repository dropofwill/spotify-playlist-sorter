(function() {
  var _, config, qs, url, utils;

  utils = exports;

  _ = require('lodash');

  qs = require('querystring');

  url = require('url');

  config = require('./config');


  /*
   * Returns a random alpha-numeric character
   */

  utils.random_alpha_numeric = function() {
    var possible;
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return possible.charAt(Math.floor(Math.random() * possible.length));
  };


  /*
   * Generates a random string containing numbers and letters
   * param  {number} length The length of the string
   * return {string} The generated string
   */

  utils.generate_random_string = function(length) {
    var text;
    text = '';
    _.times(length, function() {
      return text += utils.random_alpha_numeric();
    });
    return text;
  };


  /*
   * Warn user about missing environment variables
   */

  utils.env_error = function() {
    console.log("Please add the following to your shell env: \n SPOTIFY_CLIENT_ID='your_client_id'  \n SPOTIFY_CLIENT_SECRET='your_secret' \n UPM_REDIRECT_URI='your_redirect_uri' \n");
    return process.exit(1);
  };


  /*
   * Give the console some nice feedback when starting the node server
   */

  utils.log_server = function(port, err) {
    if (err) {
      return console.log(err);
    } else {
      return console.log("===== Serving on port " + port + " ======");
    }
  };


  /*
   * Basic building block for sending data to the client
   */

  utils.hash_builder = function(qs_obj) {
    return "/#" + (qs.stringify(qs_obj));
  };


  /*
   * Simple, local error passed as a hash url to the client
   */

  utils.local_error_builder = function(err_msg, ec) {
    if (ec == null) {
      ec = "";
    }
    console.warn("Warning: " + err_msg + " " + ec);
    return utils.hash_builder({
      error: err_msg
    });
  };


  /*
   * Check whether the client after the request is the same as the client after
   * Takes the callbacks request object and returns a boolean
   */

  utils.client_has_correct_state = function(req) {
    var ref, ref1, ref2, state, stored_state;
    state = (ref = req.query.state) != null ? ref : null;
    stored_state = (ref1 = (ref2 = req.cookies) != null ? ref2[config.state_key] : void 0) != null ? ref1 : null;
    if ((state != null) && state === stored_state) {
      return true;
    } else {
      return false;
    }
  };


  /*
   * Generate a base64 encoded buffer with the client id and secret divided by a :
   * Used when requesting token generation
   */

  utils.basic_auth_header = function() {
    var client_info;
    client_info = new Buffer(config.client_id + ":" + config.client_secret).toString('base64');
    return "Basic " + client_info;
  };


  /*
   * Simple helper for checking whether a response was successful
   */

  utils.was_good_response = function(err, res) {
    var ref;
    if (!err && (200 >= (ref = res.statusCode) && ref < 300)) {
      return true;
    } else {
      return false;
    }
  };

}).call(this);

//# sourceMappingURL=utils.js.map
