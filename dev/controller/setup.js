(function() {

  if (localStorage.getItem('database')) {
    location.href = '../routers/database.html';
  }

  angular
    .module('setup', ['file-model', 'ngMaterial', 'ngMessages'])

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

        var low = require('lowdb')

        var db = low(vm.pwdfile.path, {
          encrypt: true,
          passkey: vm.password
        })

        db('settings').push({
          created: new Date().getTime()
        })


        $window.location.href = '../routers/database.html'
      }
    }
  }

  angular
    .module('setup')
    .controller('SetupController', SetupController)

})()
