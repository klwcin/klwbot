var express = require('express')
var packageInfo = require('./package.json')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({ version: packageInfo.version, port: process.env.PORT, heroku: process.env.HEROKU_URL, env: process.env.NODE_ENV })
})

var server = app.listen(process.env.PORT, '0.0.0.0', function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Web server started at http://%s:%s', host, port)
})

module.exports = (bot) => {
  app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
  })
}