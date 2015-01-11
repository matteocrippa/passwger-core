(function() {

  if (localStorage.getItem('database')) {
    location.href = '../routers/database.html';
  }

  var app = angular.module('setup', ['file-model'])

  app.controller('SetupController', ['$log', '$window', function($log, $window) {

    this.error = ""

    var setup = this

    setup.createDb = function() {

      //$log.log(setup.pwdfile)
      //$log.log(setup.password)

      if (!setup.pwdfile) {
        setup.error = "You must select where to store your db!"
      } else if (!setup.password) {
        setup.error = "You must setup a password for lock your db!"
      } else if (setup.password.length < 4) {
        setup.error = "Password must be, at least, 4 chars long!"
      } else {
        localStorage.setItem('database', setup.pwdfile.path)

        dash.setupDB(setup.pwdfile.path, setup.password)

        $window.location.href = '../routers/database.html'
      }

    }

  }])

})()
