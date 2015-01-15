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
    }), function(newVal, oldVal) {
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

        var filteredData = params.filter() ?
          $filter('filter')(vm.db(vm.currentFolder).value(), params.filter()) :
          vm.db(vm.currentFolder).value()

        var orderedData = params.sorting ?
          $filter('orderBy')(filteredData, params.orderBy()) :
          filteredData;

        vm.table = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length)

        $defer.resolve(vm.table)
      },
      $scope: {
        $data: {}
      }
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
      return fold == vm.currentFolder
    }

    vm.selectFolder = function(fold) {
      vm.currentFolder = fold
    }

    vm.saveEntry = function() {

      $log.log(vm.currentFolder)

      switch (vm.currentFolder) {

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

          dash.addEntry(vm.currentFolder, {
            name: vm.formServerName,
            type: vm.formServerType,
            host: vm.formServerHost,
            username: vm.formServerUsername,
            password: vm.formServerPassword
          })

          vm.formServerName = vm.formServerType = vm.formServerHost = vm.formServerUsername = vm.formServerPassword = ""
          break

        case "wifi":

          dash.addEntry(vm.currentFolder, {
            name: vm.formWifiSsid,
            authmode: vm.formWifiAuthmode,
            password: vm.formWifiPassword
          })

          vm.formWifiSsid = vm.formWifiAuthmode = vm.formWifiPassword = ""
          break

        case "ccard":

          dash.addEntry(vm.currentFolder, {
            name: vm.formCcardName,
            type: vm.formCcardType,
            number: vm.formCcardNumber,
            security: vm.formCcardSecurity,
            expiry: vm.formCcardExpiry,
            cardholder: vm.formCcardCardholder
          })

          vm.formCcardName = vm.formCcardType = vm.formCcardNumber = vm.formCcardSecurity = vm.formCcardExpiry = vm.formCcardCardholder = ""
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
