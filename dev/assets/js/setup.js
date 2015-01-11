if (localStorage.getItem('database')) {
  location.href = '../routers/database.html';
}

$('#pwdfile').on('click', function() {
  var $this = $(this)
  $this.change(function(evt) {
    //console.log($(this).val())
  })
})

$('#password').on('blur', function() {
  var $this = $(this);
  if ($this.val().trim().length < 1) {
    $this.prev().removeClass('hide');
    return false;
  } else {
    $this.prev().addClass('hide');
    return true;
  }
});

function triggerFormVal() {
  if ($('#pwdfile').val().length > 0 && $('#password').val().trim().length > 0) {
    return true;
  } else {
    $('#pwdfile,#password').trigger('blur');
    return false;
  }
}

$('#login').on('click', function() {
  if (triggerFormVal()) {
    $('#form-val').addClass('hide');

    localStorage.setItem('database', $('#pwdfile').val())

    dash.setupDB($('#pwdfile').val(), $('#password').val())

    location.href = 'database.html'

  } else {
    $('#form-val').removeClass('hide');
  }
});
