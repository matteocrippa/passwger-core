(function() {

  var https = require('https')
  var fs = require('fs')
  var path = require('path')
  var express = require('express')
  var app = express()

  var privateKey = fs.readFileSync(path.join(process.cwd(), 'certs', 'server.key'), 'utf8')
  var cerificate = fs.readFileSync(path.join(process.cwd(), 'certs', 'server.crt'), 'utf8')

  var credentials = {
    key: privateKey,
    cert: cerificate
  }

  var lowdb = require('lowdb')

  var options = {
    host: 'localhost',
    port: 12358
  };

  https.get(options, function(res) {
    console.log('server is running, redirecting to localhost');
  }).on('error', function(e) {

    app.set('port', options.port);

    app.post('/setPassword', function(req, res) {

    })

    app.post('/getPassword', function(req, res) {

      try {
        var db = low(localStorage.getItem('database'), {
          encrypt: true,
          passkey: req.body.password
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

    https.createServer(credentials, app).listen(options.port, function(err) {
      console.log('server created');
    });
  });

})()
