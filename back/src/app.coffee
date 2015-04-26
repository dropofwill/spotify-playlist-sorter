require('coffee-script/register')
express   = require('express')
route     = require('./router')
path      = require('path')
http_port = 3000

app = express()

app.set('views', '../../views')
app.set('view engine', 'jade')
app.disable('x-powered-by')

app.use(express.static("front"))

server = app.listen(http_port, (err) ->
	if(err)
		console.log(err)
	else
		console.log("===== Serving on port " + http_port + " ======"))

app.get('/', (req, res) ->
  res.render('index', { title: 'Project' }))
