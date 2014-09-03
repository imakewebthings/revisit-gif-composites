var restify = require('restify')
var composites = require('gif-composites')
var dataUriToBuffer = require('data-uri-to-buffer')
var server = restify.createServer()
var port = process.env.PORT || 7000
var transform = process.env.GIF_COMPOSITE_TRANSFORM || 'tracer'

server.use(restify.acceptParser(server.acceptable))
server.use(restify.bodyParser({
  mapParams: false
}))

server.head('/', function(req, res, next) {
  res.send(200)
})

server.post('/service', function(req, res, next) {
  var buffer = dataUriToBuffer(req.body.content.data)

  if (buffer.type !== 'image/gif') {
    return res.json(req.body)
  }

  composites[transform](buffer, function(err, result) {
    var data = 'data:image/gif;base64,' + result.toString('base64')
    req.body.content.data = data
    res.json(req.body)
  })
})

server.listen(port)
console.log('%s transform service running on port %s', transform, port)
