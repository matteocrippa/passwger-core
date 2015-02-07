(function() {

  var fs = require('fs')
  var low = require('lowdb')
  var uuid = require('node-uuid')
  var _ = require('underscore')

  var gui = require('nw.gui');
  win = gui.Window.get();
  var nativeMenuBar = new gui.Menu({ type: "menubar" });
  try {
    nativeMenuBar.createMacBuiltin("My App");
    win.menu = nativeMenuBar;
  } catch (ex) {
    console.log(ex.message);
  }

  if (!localStorage.getItem('database')) {
    location.href = '../routers/setup.html'
  }

  if (!fs.existsSync(localStorage.getItem('database'))) {
    localStorage.removeItem('database')
    location.href = '../routers/setup.html'
  }

  angular
    .module('database', ['ngTable', 'ngMaterial', 'ngMessages'])

  function DatabaseController($log, $scope, $mdDialog, $window, $filter, ngTableParams) {

    var folders = ['password', 'server', 'wifi', 'ccard']

    var vm = this

    vm.db = null
    vm.table = null
    vm.tableData = []
    vm.currentFolder = 'password'
    vm.locked = true
    vm.currentEntry = null

    vm.selectedIndex = 0

    $window.document.title = 'Unlock Database // Passwger'

    var tIdle

    $window.onload = resetTimer
    $window.onmousemove = resetTimer
    $window.onmousedown = resetTimer
    $window.onclick = resetTimer
    $window.onscroll = resetTimer
    $window.onkeypress = resetTimer

    function logout() {
      $scope.$apply(function(){
        vm.password = ""
        vm.locked = true
      })
    }

    function resetTimer() {
      clearTimeout(tIdle);
      tIdle = setTimeout(logout, 300000);
    }

    $scope.$watch(angular.bind(this, function() {
      return this.selectedIndex
    }), function(newVal, oldVal) {
      vm.currentFolder = folders[newVal]
    })

    $scope.$watch(angular.bind(this, function() {
      return this.currentFolder
    }), function(newVal, oldVal) {
      //$scope.tableParams.reload()
      vm.reloadTable()
    })

    $scope.$watch(angular.bind(this, function(){
      if(this.db){
        return this.db(vm.currentFolder).value().length
      }else{
        return 0
      }
    }),function(newVal, oldVal){
      vm.reloadTable()
      //$scope.tableParams.reload()
    })
    
    $scope.$watch(angular.bind(this, function() {
      return this.filter
    }), function(newVal, oldVal) {
      vm.reloadTable()
    })
    
    vm.reloadTable = function() {
      
      if(vm.db) {
        
        var dbItems = vm.db(vm.currentFolder).value()
        
        var filteredData = vm.filter ? _.filter(dbItems, function(item){ return item.name.indexOf(vm.filter) != -1 }) : dbItems
      
        vm.tableData = _.orderBy(filteredData, function(item){ retun item.name })
        
      }
      
    }

    /*$scope.tableParams = new ngTableParams({
      page: 1,
      count: 20,
      sorting: {
        name: 'asc'
      }
    }, {
      total: vm.db ? vm.db(vm.currentFolder).value().length : 0,
      getData: function($defer, params) {

        if(vm.db){
          var filteredData = params.filter() ?
          $filter('filter')(vm.db(vm.currentFolder).value(), params.filter()) :
          vm.db(vm.currentFolder).value()

          var orderedData = params.sorting ?
          $filter('orderBy')(filteredData, params.orderBy()) :
          filteredData;

          vm.table = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

          params.total(orderedData.length)

          $defer.resolve(vm.table)
        }else{
          $defer.resolve([])
        }

      },
      $scope: {
        $data: {}
      }
    })*/

    vm.showModal = function(ev) {
      $mdDialog.show({
        controller: function($scope, $mdDialog, form) {

          if(form){
            $scope.form = form
          }

          $scope.passwordReveal = false

          $scope.cancel = function() {
            $mdDialog.cancel()
          }

          $scope.remove = function() {

            vm.db(vm.currentFolder).remove({
              id: $scope.form.id
            })
            vm.currentEntry = null

            $mdDialog.hide()

          }

          $scope.save = function(form) {

            if($scope.form.id){

              vm.db(vm.currentFolder).find({
                id: $scope.form.id
              }).assign($scope.form)

              vm.currentEntry = null

            }else{

              $scope.form.id = uuid.v4()

              vm.db(vm.currentFolder).push($scope.form)

            }

            $mdDialog.hide()

          }

          $scope.revealPassword = function() {
            $scope.passwordReveal = true
          }

          $scope.copyPassword = function() {

            var gui = require('nw.gui')
            var clipboard = gui.Clipboard.get()

            clipboard.clear()

            var item = ''

            if($scope.form.cvv){
              item = $scope.form.cvv
            }else{
              item = $scope.form.password
            }

            clipboard.set(item, 'text')
          }

        },
        templateUrl: 'modals/form.' + vm.currentFolder + '.tmpl.html',
        targetEvent: ev,
        locals: {
          form: vm.currentEntry
        }
      })
    }


    vm.totalFolderItems = function(folder) {
      if(vm.db){
        if (vm.db(folder).value()) {
          return vm.db(folder).value().length
        } else {
          return 0
        }
      }else{
        return 0
      }
    }

    vm.unlockDb = function() {

      try {
        vm.db = low(localStorage.getItem('database'), {
          encrypt: true,
          passkey: vm.password
        })
      } catch (ex) {
        alert('Error: wrong unlock password.')
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

    vm.setCurrentEntry = function(item) {
      vm.currentEntry = vm.db(vm.currentFolder).find({
        id: item
      }).value()
    }

    vm.unsetCurrentEntry = function() {
      vm.currentEntry = null
    }

  }

  angular
    .module('database')
    .controller('DatabaseController', DatabaseController)


})()
