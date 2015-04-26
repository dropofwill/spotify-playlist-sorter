(function() {
  var app, express, http_port, path, route, server;

  require('coffee-script/register');

  express = require('express');

  route = require('./router');

  path = require('path');

  http_port = 3000;

  app = express();

  app.set('views', '../../views');

  app.set('view engine', 'jade');

  app.disable('x-powered-by');

  app.use(express["static"]("front"));

  server = app.listen(http_port, function(err) {
    if (err) {
      return console.log(err);
    } else {
      return console.log("===== Serving on port " + http_port + " ======");
    }
  });

  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'Project'
    });
  });

}).call(this);

//# sourceMappingURL=app.js.map
