// Requires and libs set
var express = require('express')
var packageInfo = require('./package.json')

// Create app and path
var app = express()
var path = require('path')

// Web page shown
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

// Start server
var server = app.listen(80, '0.0.0.0', () => {
  var host = server.address().address
  var port = server.address().port
  console.log('Web server started at http://%s:%s', host, port)
})