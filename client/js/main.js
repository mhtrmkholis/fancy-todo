let todo = []
let filteredTodos = []

function signin(email, password) {
  $.post('http://localhost:3000/api/users/signin', { email, password })
    .done(response => {
      localStorage.setItem('token', response.token)
      localStorage.setItem('name', response.name)
      Swal.fire({
        type: 'success',
        title: 'Login Success',
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(function () {
        $('#landing-page').hide()
        $('#todo-page').show()
        fetchTodo()
      }, 1800);
    })
    .fail(err => {
      Swal.fire({
        type: 'error',
        title: `${err.responseJSON}`,
        showConfirmButton: false,
        timer: 1500
      })
    })
}

function register(input) {
  $.post('http://localhost:3000/api/users', input)
    .done(response => {
      Swal.fire({
        type: 'success',
        title: 'Create Success',
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(function () {
        $('#landing-page').show()
        $('#register-page').hide()
      }, 1800);
    })
    .fail(err => {
      Swal.fire({
        type: 'error',
        title: `${err.responseJSON.split(':').slice(2).map(el => el.split(',')[0])}`,
        showConfirmButton: true
      })
    })
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;

  $.post({ url: 'http://localhost:3000/api/users/signin/google', headers: { id_token } })
    .done(response => {
      localStorage.setItem('token', response.token)
      localStorage.setItem('name', response.name)
      Swal.fire({
        type: 'success',
        title: 'Login Success',
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(function () {
        $('#landing-page').hide()
        $('#todo-page').show()
        fetchTodo()
      }, 1800);
    })
    .fail(err => {
      Swal.fire({
        type: 'error',
        title: `${err.responseJSON}`,
        showConfirmButton: false,
        timer: 1500
      })
    })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  localStorage.clear()
  Swal.fire({
    type: 'success',
    title: `Signout Success`,
    showConfirmButton: false,
    timer: 1500
  })
  setTimeout(function () {
    $('#landing-page').toggle()
    $('#todo-page').toggle()
    $('#navbar').toggle()
  }, 1800)
}

function fetchTodo() {
  $('#navbar').show()
  $.get({
    url: 'http://localhost:3000/api/todos',
    headers: { token: localStorage.token }
  })
    .done(response => {
      $('#current-time').empty()
      $('#todo-welcome-name').empty()
      $('#modal-footer').empty()
      $('#todo-name').empty()
      getCurrentTime()
      todo = response
      $('#todo-welcome-name').append(`
      Hey ${localStorage.name.split(' ')[0]},<br>
      this is your to-do list.
    `)
      response.forEach((el, i) => {
        $('#todo-name').append(`
        <li class="collection-item">
          ${el.name}<a href="#modal1" class="secondary-content modal-trigger" onclick="detailTodo(${i})"><i class="material-icons icon">send</i></a>
        </li> 
      `)
      })
    })
    .fail(err => {
      console.log(err)
    })
}

function detailTodo(index) {
  for (let i = 0; i < todo.length; i++) {
    if (i == index) {
      $('#todo-detail').empty()
      $('#modal-footer').empty()
      $('#todo-detail').append(`
        <h3 style="text-align: center; margin-bottom: 50px">Detail Activity</h3>
        <input type="text" id="edit-name" class="autocomplete" value="${todo[i].name}">
        <input type="date" id="edit-due-date" class="autocomplete" value="${new Date(todo[i].due_date).toISOString().substring(0, 10)}">
        <textarea id="edit-description" class="autocomplete" style="padding:10px; height: 150px; margin-top: 20px">${todo[i].description}</textarea>
      `)
      if(todo[i].status == false) {
        $('#todo-detail').append(`
          <p>
            <label style="margin: 0px">
              <input id="edit-status" type="checkbox" />
              <span>Complete</span>
            </label>
          </p>
        `)
      }
      $('#modal-footer').append(`
        <a class="waves-effect waves-light btn" style="background-color:#c62828" onclick="deleteTodo('${todo[i]._id}')"><i class="material-icons left">delete</i><b style="color: white">Delete</b></a>
        <a class="waves-effect waves-light btn" style="background-color:#0277bd" onclick="updateTodo('${todo[i]._id}')"><i class="material-icons left">sync</i><b style="color: white">Update</b></a>
      `)
    }
  }
}

function filteredTodo(index) {
  for (let i = 0; i < filteredTodos.length; i++) {
    if (i == index) {
      $('#todo-detail').empty()
      $('#modal-footer').empty()
      $('#todo-detail').append(`
        <h3 style="text-align: center; margin-bottom: 50px">Detail Activity</h3>
        <input type="text" id="edit-name" class="autocomplete" value="${filteredTodos[i].name}">
        <input type="date" id="edit-description" class="autocomplete" value="${new Date(filteredTodos[i].due_date).toISOString().substring(0, 10)}">
        <textarea id="edit-due-date" class="autocomplete" style="padding:10px; height: 150px; margin-top: 20px">${filteredTodos[i].description}</textarea>
      `)
      $('#modal-footer').append(`
        <a class="waves-effect waves-light btn" style="background-color:#c62828" onclick="deleteTodo('${filteredTodos[i]._id}')"><i class="material-icons left">delete</i><b style="color: white">Delete</b></a>
        <a class="waves-effect waves-light btn" style="background-color:#0277bd" onclick="updateTodo('${filteredTodos[i]._id}')"><i class="material-icons left">sync</i><b style="color: white">Update</b></a>
      `)
    }
  }
}

function addTodo() {
  Swal.mixin({
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '3']
  }).queue([
    {
      input: 'text',
      title: 'Enter Title',
    },
    {
      input: 'textarea',
      title: 'Enter Description'
    },
    {
      input: 'text',
      title: 'Enter Due Date',
      inputPlaceholder: 'MM-DD-YYYY'
    }
  ]).then((result) => {
    if (result.value) {
      $.post({
        url: 'http://localhost:3000/api/todos',
        headers: { token: localStorage.token },
        data: {
          name: result.value[0],
          description: result.value[1],
          due_date: result.value[2],
        }
      })
        .done(() => {
          Swal.fire({
            type: 'success',
            title: 'Task Created',
            showConfirmButton: false,
            timer: 1500
          })
          $('#todo-welcome-name').empty()
          $('#todo-name').empty()
          fetchTodo()
        })
        .fail(err => {
          Swal.fire({
            type: 'error',
            title: `${err.responseJSON}`,
            showConfirmButton: true,
          })
        })
    }
  })
}

function randomTodo() {
  $.get('http://localhost:3000/api/bored')
    .done(response => {
      Swal.fire({
        input: 'text',
        title: 'Enter Due Date',
        inputPlaceholder: 'MM-DD-YYYY'
      })
        .then(result => {
          if (result.value) {
            $.post({
              url: 'http://localhost:3000/api/todos',
              headers: { token: localStorage.token },
              data: {
                name: response,
                description: `Just ${response}`,
                due_date: result.value,
              }
            })
              .done(response => {
                Swal.fire({
                  type: 'success',
                  title: 'Task Created',
                  showConfirmButton: false,
                  timer: 1500
                })
                $('#todo-welcome-name').empty()
                $('#todo-name').empty()
                fetchTodo()
              })
              .fail(err => {
                Swal.fire({
                  type: 'error',
                  title: `${err}`,
                  showConfirmButton: true,
                })
              })
          }
        })
    })
    .fail(err => console.log(err))
}

function getCurrentTime() {
  let curHr = new Date().getHours()
  if (curHr < 12) {
    $('#current-time').append(`<h3 style="margin-bottom: 0px">Good Morning,<br> ${localStorage.name}</h3>`)
  } else if (curHr < 18) {
    $('#current-time').append(`<h3 style="margin-bottom: 0px">Good Afternoon,<br> ${localStorage.name}</h3>`)
  } else {
    $('#current-time').append(`<h3 style="margin-bottom: 0px">Good Evening,<br> ${localStorage.name}</h3>`)
  }
}

function deleteTodo(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url: `http://localhost:3000/api/todos/${id}`,
        method: 'DELETE',
        headers: { token: localStorage.token }
      })
        .done(() => {
          $('#todo-welcome-name').empty()
          $('#todo-name').empty()
          fetchTodo()
          Swal.fire({
            type: 'success',
            title: 'Success Delete',
            showConfirmButton: false,
            timer: 1500
          })
          $('#modal1').toggle()
        })
        .fail(err => console.log(err))
    }
  })
}

function updateTodo(id) {
  Swal.fire({
    title: 'Are you sure?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, update it!'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url: `http://localhost:3000/api/todos/${id}`,
        method: 'PUT',
        headers: { token: localStorage.token },
        data: {
          name: $('#edit-name').val(),
          description: $('#edit-description').val(),
          due_date: $('#edit-due-date').val(),
          status: $('#edit-status').val() ? true : false
        }
      })
        .done(() => {
          $('#todo-welcome-name').empty()
          $('#todo-name').empty()
          fetchTodo()
          Swal.fire({
            type: 'success',
            title: 'Success Update',
            showConfirmButton: false,
            timer: 1500
          })
          $('#modal1').toggle()
        })
        .fail(err => {
          Swal.fire({
            type: 'error',
            title: `${err.responseJSON}`,
            showConfirmButton: true
          })
        })
    }
  })
}

function generateQuote() {
  $.get({
    url: "http://localhost:3000/api/quote",
  })
    .done(response => {
      $('#quoteText').text(`"${response.quoteText}"`)
      $('#quoteAuthor').text(`- ${response.quoteAuthor} -`)
    })
    .fail(err => console.log(err))
}

function filtering(param) {
  $('#todo-name').empty()
  
  if (!param) {
    let incomplete = todo.filter(el => el.status == false)
    if (!incomplete.length) {
      $('#todo-name').append(`
      <li class="collection-item">
        <p style="margin: 0px">There is no incompleted task</p>
      </li> 
    `)
    }
    else {
      incomplete.forEach((el, i) => {
        $('#todo-name').append(`
        <li class="collection-item">
          ${el.name}<a href="#modal1" class="secondary-content modal-trigger" onclick="detailTodo(${i})"><i class="material-icons icon">send</i></a>
        </li> 
      `)
      })
    }
  }
  else {
    let complete = todo.filter(el => el.status)
    if (!complete.length) {
      $('#todo-name').append(`
      <li class="collection-item">
        <p style="margin: 0px">There is no completed task</p>
      </li> 
    `)
    }
    else {
      complete.forEach((el, i) => {
        $('#todo-name').append(`
        <li class="collection-item">
          ${el.name}<a href="#modal1" class="secondary-content modal-trigger" onclick="detailTodo(${i})"><i class="material-icons icon">send</i></a>
        </li> 
      `)
      })
    }
  }
}

$(document).ready(function () {
  $('.modal').modal();
  $('#register-page').hide()
  $('#todo-page').hide()
  $('#navbar').hide()
  // $('#todo-page').show()

  $('#login-form').submit(function (e) {
    e.preventDefault()
    const email = $('#login-email').val()
    const password = $('#login-password').val()
    signin(email, password)
  })

  $('#landing-signup-btn').click(function () {
    $('#landing-page').hide()
    $('#register-page').show()
  })

  $('#register-back-btn').click(function () {
    $('#landing-page').show()
    $('#register-page').hide()
  })

  $('#register-form').submit(function (e) {
    e.preventDefault()
    const name = $('#register-name').val()
    const email = $('#register-email').val()
    const password = $('#register-password').val()
    register({ name, email, password })
  })

  $("#todo-search").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    const regex = new RegExp(value, 'i')
    let filtered = todo.filter(todos => {
      return todos.name.match(regex)
    })
    if (filtered.length) {
      filteredTodos = filtered
      $('#todo-name').empty()
      filtered.forEach((el, i) => {
        $('#todo-name').append(`
        <li class="collection-item">
          ${el.name}<a href="#modal1" class="secondary-content modal-trigger" onclick="filteredTodo(${i})"><i class="material-icons icon">send</i></a>
        </li> 
        `)
      })
    }
    else {
      $('#todo-name').empty()
      $('#todo-name').append(`
        <li class="collection-item">
          No match found
        </li> `
      )
    }
  });
  $('#generateQuoteButton').click(event => {
    generateQuote()
  })
})