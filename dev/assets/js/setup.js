(function() {

  if (localStorage.getItem('database')) {
    location.href = '../routers/database.html';
  }

  angular
    .module('setup', ['file-model'])

  function SetupController($log, $window) {
    var vm = this

    vm.error = ""

    vm.createDb = function() {
      if (!vm.pwdfile) {
        vm.error = "You must select where to store your db!"
      } else if (!vm.password) {
        vm.error = "You must setup a password for lock your db!"
      } else if (vm.password.length < 4) {
        vm.error = "Password must be, at least, 4 chars long!"
      } else {
        localStorage.setItem('database', vm.pwdfile.path)

        dash.setupDB(vm.pwdfile.path, vm.password)

        $window.location.href = '../routers/database.html'
      }
    }
  }

  angular
    .module('setup')
    .controller('SetupController', SetupController)

})()