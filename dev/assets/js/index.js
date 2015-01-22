var fs = require('fs')

if (localStorage.getItem('database')) {
  if (!fs.existsSync(localStorage.getItem('database'))) {
    localStorage.removeItem('database')
    location.href = '../routers/setup.html'
  } else {
    location.href = '../routers/database.html'
  }
} else {
  location.href = '../routers/setup.html'
}
