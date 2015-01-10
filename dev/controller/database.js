window.dash = window.dash || {}

var low = require('lowdb')
low.mixin(require('underscore-db'))

var db = null

dash.openDB = function(pwd) {

  try{
    db = low(localStorage.getItem('database'), {
      encrypt: true,
      passkey: pwd
    })
  }catch(ex){
    return false
  }

  return db

}

dash.addEntry = function(type, entry) {

  return db(type).push(entry).value().id

}
