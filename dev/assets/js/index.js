if (localStorage.getItem('database')) {
  if (!dash.dbExists()) {
    localStorage.removeItem('database')
    location.href = '../routers/setup.html'
  } else {
    location.href = '../routers/database.html'
  }
} else {
  location.href = '../routers/setup.html'
}
