(function() {

  if (!localStorage.getItem('database')) {
    location.href = '../routers/setup.html'
  }

  if (!dash.dbExists()) {
    localStorage.removeItem('database')
    location.href = '../routers/setup.html'
  }

  angular
    .module('database', ['ngTable'])

  function DatabaseController($log, $scope, $window, $filter, ngTableParams) {

    var vm = this

    vm.db = null
    vm.table = null
    vm.currentFolder = 'password'
    vm.locked = true

    $window.document.title = 'Unlock Database // Passwger'

    $scope.$watch(angular.bind(this, function() {
      return this.currentFolder
    }), function (newVal, oldVal) {
      $scope.tableParams.reload()
    })

    $scope.tableParams = new ngTableParams({
      page: 1,
      count: 20,
      sorting: {
        name: 'asc'
      }
    }, {
      total: vm.db ? vm.db(vm.currentFolder).value().length : 0,
      getData: function($defer, params) {

        var orderedData = params.filter() ?
        $filter('filter')(vm.db(vm.currentFolder).value(), params.filter()) :
        vm.db(vm.currentFolder).value()

        vm.table = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length) // set total for recalc pagination

        $defer.resolve(vm.table)
      },
      $scope: { $data: {} }
    })


    vm.totalFolderItems = function(folder) {
      if (vm.db(folder).value()) {
        return vm.db(folder).value().length
      } else {
        return 0
      }
    }

    vm.unlockDb = function() {

      vm.db = dash.openDB(vm.password)

      if (vm.db == false) {
        alert('Error: wrong unlock password.')
        return
      }

      if (vm.db.object.settings[0].created) {
        vm.locked = false

        $window.document.title = 'Database // Passwger'

        $scope.tableParams.reload()

      } else {
        vm.locked = true
      }
    }

    vm.isCurrentFolder = function(fold) {
      if (fold == vm.currentFolder) {
        return true
      } else {
        return false
      }
    }

    vm.selectFolder = function(fold) {
      vm.currentFolder = fold
    }

    vm.saveEntry = function() {

      switch(vm.currentFolder) {

        case "password":

          dash.addEntry(vm.currentFolder, {
            name: vm.formPasswordName,
            host: vm.formPasswordHost,
            username: vm.formPasswordUsername,
            password: vm.formPasswordPassword
          })

          vm.formPasswordName = vm.formPasswordHost = vm.formPasswordUsername = vm.formPasswordPassword = ""
          break

        case "server":
          break

        case "wifi":
          break

        case "ccard":
          break

        default:
          break
      }

    }

  }

  angular
    .module('database')
    .controller('DatabaseController', DatabaseController)

})()


/*
$(document).ready(function() {



  $('#saveEntry').on('click', function(e) {

    e.preventDefault()

    var currentFolder = getCurrentFolder()

    // TODO: #11 check all required fields are populated before save

    switch (currentFolder) {
      case 'password':

        dash.addEntry(currentFolder, {
          name: $('#form-password-name').val(),
          host: $('#form-password-host').val(),
          username: $('#form-password-username').val(),
          password: $('#form-password-password').val()
        })

        $('#form-password-username').val('')
        $('#form-password-password').val('')
        $('#form-password-host').val('')
        $('#form-password-name').val('')

        break

      case 'wifi':

        dash.addEntry(currentFolder, {
          name: $('#form-wifi-ssid').val(),
          authmode: $('#form-wifi-authmode').val(),
          password: $('#form-wifi-password').val()
        })

        $('#form-wifi-ssid').val('')
        $('#form-wifi-authmode').val('')
        $('#form-wifi-password').val('')

        break

      case 'server':

        dash.addEntry(currentFolder, {
          name: $('#form-server-name').val(),
          type: $('#form-server-type').val(),
          host: $('#form-server-host').val(),
          username: $('#form-server-username').val(),
          password: $('#form-server-password').val()
        })

        $('#form-wifi-name').val('')
        $('#form-wifi-type').val('')
        $('#form-wifi-host').val('')
        $('#form-wifi-username').val('')
        $('#form-wifi-password').val('')

        break


      default:
        break
    }

    showTotItemsFolder()

    populateList(currentFolder)

    $('#compose-modal').modal('hide')
  })

})*/
