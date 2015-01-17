window.dash = window.dash || {}

var low = require('lowdb')
var uuid = require('node-uuid')

var db = null

dash.openDB = function(pwd) {

  try {
    db = low(localStorage.getItem('database'), {
      encrypt: true,
      passkey: pwd
    })
  } catch (ex) {
    return false
  }

  return db

}

dash.addEntry = function(type, entry) {
  entry.id = uuid.v4()
  return db(type).push(entry)
}

dash.updateEnty = function(eid, type, entry) {
  return db(type).find({
    id: eid
  }).assign(entry)
}

dash.removeEntry = function(eid, type) {
  return db(type).remove({
    id: eid
  })
}
