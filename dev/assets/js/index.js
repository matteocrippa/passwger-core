if (localStorage.getItem('database')) {
  if (!dash.dbExists()) {
    localStorage.removeItem('database')
    location.href = 'setup.html'
  } else {
    location.href = 'database.html'
  }
} else {
  location.href = 'setup.html'
}
