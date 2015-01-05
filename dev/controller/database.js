window.dash = window.dash || {}

var low = require('lowdb')

var db = null

dash.openDB = function(pwd){

  db = low(localStorage.getItem('database'), {
    encrypt: true,
    passkey: pwd
  })

  return db

}

dash.addEntry = function(type,entry){

  db(type).push(entry)

}
