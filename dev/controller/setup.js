window.dash = window.dash || {}

var low = require('lowdb')

dash.setupDB = function(path, pwd) {

  var db = low(path, {
    encrypt: true,
    passkey: pwd
  })

  db('settings').push({
    created: new Date().getTime()
  })

  return true
}