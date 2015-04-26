express   = require('express')
route     = require('./router.coffee')
path      = require('path')
http_port = 3000

app.set('views', './views')
app.set('view engine', 'jade')
app.disable('x-powered-by')

server = app.listen(config.http_port, (err) ->
	if(err)
		console.log(err)
	else
		console.log("===== Serving on port " + http_port + " ======"))

app.get('/', (req, res) ->
  res.render('index', { title: 'Project' }))
