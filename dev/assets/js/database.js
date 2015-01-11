(function() {

  if (!localStorage.getItem('database')) {
    location.href = '../routers/setup.html'
  }

  if (!dash.dbExists()) {
    localStorage.removeItem('database')
    location.href = '../routers/setup.html'
  }

  var app = angular.module('database', [])

  app.controller('DatabaseController', ['$log', '$window', function($log, $window) {

    var dbc = this

    dbc.db = null
    dbc.table = null
    dbc.currentFolder = 'password'
    dbc.locked = true

    $window.document.title = 'Unlock Database // Passwger'

    dbc.unlockDb = function() {

      dbc.db = dash.openDB(dbc.password)

      if (dbc.db == false) {
        alert('Error: wrong unlock password.')
        return
      }

      if (dbc.db.object.settings[0].created) {

        dbc.locked = false

        $window.document.title = 'Database // Passwger'
        
        if(dbc.db('password')) {
          dbc.totPassword = dbc.db('password').length
        }
        
        /*populateList('password')

        prepareAddEntry('password')

        $('#btn-addnew').html('<i class="fa fa-pencil"></i> Add new password')

        showTotItemsFolder()*/

      } else {
        dbc.locked = true
      }
    }

    dbc.saveEntry = function() {

    }

    dbc.isCurrentFolder = function(fold) {
      //$log.log('check '+fold)
      if (fold == dbc.currentFolder) {
        return true
      }else{
        return false
      }
    }

    dbc.selectFolder = function(fold) {
      //$log.log(fold)
      dbc.currentFolder = fold
      dbc.table = db(fold).value()
    }
    
    dbc.filterEntry = function() {
      //populateList(getCurrentFolder(), $('#filter-entry').val())
    }
    
    dbc.populateList = function() {
      /*filter = populateList.arguments.length < 2 ? null : filter;

  $('#fold-' + folder).addClass('active')

  $('#password-list').children().children().remove()

  if (db(folder)) {

    if (db(folder).value().length > 0) {

      $.each(db(folder).sortBy('name').filter(function(item) {
        if (filter) {
          return item.name.toLowerCase().indexOf(filter.toLowerCase()) > -1
        } else {
          return true
        }
      }).value(), function(index, value) {

        var classItem = ""

        if (index % 2 == 0) {
          classItem = "class='unread'"
        }

        var item = "<tr " + classItem + "> \
        <td class='small-col'><div class='domain-icon' style='background-image: url('assets/img/placeholder-icon.png');'></div></td> \
        <td class='name'><a href='#'>" + value.name +
          "</a></td> \
        </tr>"

        $('#password-list').append(item)

      })
    } else {
      $('#password-list').append('<tr><td class="name">No items stored yet.</td></tr>')
    }


  } else {
    $('#password-list').append('<tr><td class="name">No items stored yet.</td></tr>')
  }*/
    }

  }])

})()


var db = null



$(document).ready(function() {

  /*$('#a-password').on('click', function() {
    deselectAllFolder()
    populateList('password')
    prepareAddEntry('password')
    $('#btn-addnew').html('<i class="fa fa-pencil"></i> Add new password')
  })*/

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

})


function prepareAddEntry(folder) {

  if (!$('#form-ccard').hasClass('hide')) {
    $('#form-ccard').addClass('hide')
  }

  if (!$('#form-server').hasClass('hide')) {
    $('#form-server').addClass('hide')
  }

  if (!$('#form-wifi').hasClass('hide')) {
    $('#form-wifi').addClass('hide')
  }

  if (!$('#form-password').hasClass('hide')) {
    $('#form-password').addClass('hide')
  }

  $('#form-' + folder).removeClass('hide')
}
