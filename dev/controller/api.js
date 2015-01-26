(function() {

  var http = require('http')
  var path = require('path')
  var express = require('express')
  var app = express()

  var lowdb = require('lowdb')


  var options = {
    host: 'localhost',
    port: 12358
  };

  http.get(options, function(res) {
    console.log('server is running, redirecting to localhost');
  }).on('error', function(e) {

    app.set('port', options.port);

    app.post('/getData', function(req,res){

      try {
        var db = low(localStorage.getItem('database'), {
          encrypt: true,
          passkey: req.body.password
        })

        res.send({data: db})
      } catch (ex) {
        res.send({ error: 'wrong unlock password.'})
      }

    })

    http.createServer(app).listen(options.port, function(err){
      console.log('server created');
    });
  });

})()
