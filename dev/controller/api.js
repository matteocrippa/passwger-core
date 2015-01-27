(function() {

  var http = require('http')
  var express = require('express')
  var app = express()
  var bodyParser = require('body-parser')

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded())

  var low = require('lowdb')

  var options = {
    host: 'localhost',
    port: 12358
  }

  http.get(options, function(res) {
    console.log('server is running, redirecting to localhost');
  }).on('error', function(e) {

    app.set('port', options.port);

    app.post('/setPassword', function(req, res) {

    })

    app.post('/getPassword', function(req, res) {

      try {
        var db = low(localStorage.getItem('database'), {
          encrypt: true,
          passkey: req.body.pwd
        })

        res.send({
          pwds: db('password').value()
        })

      } catch (ex) {
        res.send({
          error: 'wrong unlock password.'
        })
      }

    })

    http.createServer(app).listen(options.port, function(err) {
      console.log('server created');
    })
  })

})()
