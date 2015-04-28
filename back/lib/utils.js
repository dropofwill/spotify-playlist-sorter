(function() {
  var _, utils;

  utils = exports;

  _ = require('lodash');


  /*
   * Returns a random alpha-numeric character
   */

  utils.randomAlphaNumeric = function() {
    var possible;
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return possible.charAt(Math.floor(Math.random() * possible.length));
  };


  /*
   * Generates a random string containing numbers and letters
   * param  {number} length The length of the string
   * return {string} The generated string
   */

  utils.generateRandomString = function(length) {
    var text;
    text = '';
    _.times(length, function() {
      return text += utils.randomAlphaNumeric();
    });
    return text;
  };

  utils.envError = function() {
    console.log("Please add: \n SPOTIFY_CLIENT_ID='your_client_id' \n SPOTIFY_CLIENT_SECRET='your_secret' ");
    return process.exit(1);
  };

  utils.logServer = function(port, err) {
    if (err) {
      return console.log(err);
    } else {
      return console.log("===== Serving on port " + port + " ======");
    }
  };

}).call(this);

//# sourceMappingURL=utils.js.map
