window.dash = window.dash || {}

var fs = require('fs')

dash.dbExists = function() {
  return fs.existsSync(localStorage.getItem('database'))
}