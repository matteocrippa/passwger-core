var db = null

if (!localStorage.getItem('database')) {
  location.href = '../routers/setup.html'
}

if (!dash.dbExists()) {
  localStorage.removeItem('database')
  location.href = '../routers/setup.html'
}

$(document).ready(function() {

  if (!db) {
    document.title = 'Unlock Database // Passwger'
    $('#unlock-box').removeClass('hide')
  }

  $('#filter-entry').on('keyup', function(){
    populateList(getCurrentFolder(), $('#filter-entry').val())
  })

  $('#a-password').on('click', function() {
    deselectAllFolder()
    populateList('password')
    prepareAddEntry('password')
    $('#btn-addnew').html('<i class="fa fa-pencil"></i> Add new password')
  })

  $('#a-wifi').on('click', function() {
    deselectAllFolder()
    populateList('wifi')
    prepareAddEntry('wifi')
    $('#btn-addnew').html('<i class="fa fa-pencil"></i> Add new wifi')
  })

  $('#a-ccard').on('click', function() {
    deselectAllFolder()
    populateList('ccard')
    prepareAddEntry('ccard')
    $('#btn-addnew').html('<i class="fa fa-pencil"></i> Add new credit card')
  })

  $('#a-server').on('click', function() {
    deselectAllFolder()
    prepareAddEntry('server')
    populateList('server')
    $('#btn-addnew').html('<i class="fa fa-hdd-o"></i> Add new server')
  })

  $('#unlock').on('click', function() {

    db = dash.openDB($('#password').val())

    if(db == false){
      alert('Wrong password')
      return
    }

    if (db.object.settings[0].created) {
      $('#unlock-box').addClass('hide')
      $('#database-box').removeClass('hide')

      document.title = 'Database // Passwger'

      populateList('password')

      prepareAddEntry('password')

      $('#btn-addnew').html('<i class="fa fa-pencil"></i> Add new password')

      showTotItemsFolder()

    } else {
      $('#unlock-wrongpass').removeClass('hide')
    }

  })

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

function populateList(folder, filter) {

  filter = populateList.arguments.length<2 ? null : filter;

  $('#fold-' + folder).addClass('active')

  $('#password-list').children().children().remove()

  if (db(folder)) {

    if (db(folder).value().length > 0) {

      $.each(db(folder).sortBy('name').filter(function(item){
        if(filter){
          return item.name.toLowerCase().indexOf(filter.toLowerCase()) > -1
        }else{
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
  }

}

function showTotItemsFolder() {

  if (db.object.password) {
    $('#fold-password a').html('<i class="fa fa-key"></i> Password (' + db.object.password.length + ')')
  } else {
    $('#fold-password a').html('<i class="fa fa-key"></i> Password (0)')
  }

  if (db.object.wifi) {
    $('#fold-wifi a').html('<i class="fa fa-rss"></i> Wi-Fi (' + db.object.wifi.length + ')')
  } else {
    $('#fold-wifi a').html('<i class="fa fa-rss"></i> Wi-Fi (0)')
  }

  if (db.object.server) {
    $('#fold-server a').html('<i class="fa fa-hdd-o"></i> Server (' + db.object.server.length + ')')
  } else {
    $('#fold-server a').html('<i class="fa fa-hdd-o"></i> Server (0)')
  }

  /*if(db.object.identity){
  $('#fold-identity a').html('<i class="fa fa-male"></i> Identity ('+db.object.identity.length+')')
}else{
$('#fold-identity a').html('<i class="fa fa-male"></i> Identity (0)')
}*/

  if (db.object.ccard) {
    $('#fold-ccard a').html('<i class="fa fa-credit-card"></i> Credit Card (' + db.object.ccard.length + ')')
  } else {
    $('#fold-ccard a').html('<i class="fa fa-credit-card"></i> Credit Card (0)')
  }

}

function deselectAllFolder() {

  $('#folder-menu li').each(function(index, value) {
    $(value).removeClass('active')
  })

}

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

function getCurrentFolder() {

  var folderId = 'password'

  $('#folder-menu li').each(function(index, value) {

    if ($(value).hasClass('active')) {
      folderId = $(value).attr('id').toString().replace('fold-', '')
    }
  })

  return folderId
}
