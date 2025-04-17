var url = "https://apitrest.onrender.com/api/users";

function postUser() {
    var myuser = {
        name: $('#name').val(),
        email: $('#email').val(),
        age: $('#age').val(),
        comments: $('#comments').val()
    };

    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(myuser),
        success: function (data) {
            Swal.fire('Usuario agregado correctamente', '', 'success');
            getUsers();
            closeModal();
        }
    });
}
/*
function getUsers() {
    $.getJSON(url, function(json) {
        let users = json.users;
        let html = `<table>
          <tr>
            <th>ID</th><th>Nombre</th><th>Email</th><th>Edad</th><th>Comentarios</th><th>Acciones</th>
          </tr>`;

        users.forEach(user => {
            html += `<tr>
              <td>${user.id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.age}</td>
              <td>${user.comments}</td>
              <td class="accions">
                <button class="btn-edit" onclick="confirmUpdate(${user.id})">
                  <i class="fas fa-edit"></i><span>Editar</span>
                </button>
                <button class="btn-delete" onclick="confirmDelete(${user.id})">
                  <i class="fas fa-trash-alt"></i><span>Eliminar</span>
                </button>
              </td>
            </tr>`;
        });

        html += '</table>';
        $('#resultado').html(html);
    });
}
*/
async function searchUser() {
    $('#spinner-container').show();
    $('#resultado').empty();
  
    const input = $('#text').val().trim();
  
    if (input === '') {
      Swal.fire('Empty input ', 'Please type somthing to search', 'warning');
      $('#spinner-container').hide();
      return;
    }
  
    let userData = [];
  
    if (/^\d+$/.test(input)) {
      // Búsqueda por ID
      try {
        const response = await fetch(`${url}/${input}`);
        if (!response.ok) throw new Error('User not found');
        
        const data = await response.json();     
        const user = data.user; // 
        userData.push(user);
      } catch (error) {
        console.error(error);
        Swal.fire('Not found', 'No user with this ID was found', 'error');
        $('#spinner-container').hide();
        return;
      }
  
    } else {
      // Búsqueda por nombre
      try {
        const response = await fetch(url);
        const data = await response.json();
        const users = data.users;
  
        userData = users.filter(user =>
          user.name.toLowerCase().includes(input.toLowerCase())
        );
  
        if (userData.length === 0) {
          Swal.fire('Not found', 'No user with this name was found.', 'info');
          $('#spinner-container').hide();
          return;
        }
  
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Oops, Has been a trouble to search users .', 'error');
        $('#spinner-container').hide();
        return;
      }
    }
  
    // Construcción de la tabla
    let html = `<table>
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Email</th><th>Age</th><th>Comments</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>`;
  
    userData.forEach(user => {
      html += `<tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.age}</td>
        <td>${user.comments}</td>
        <td class="accions">
          <button class="btn-edit" onclick="handleEdit(${user.id})" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn-delete" onclick="confirmDelete(${user.id})" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>`;
    });
  
    html += `</tbody></table>`;
  
    $('#resultado').html(html);
    $('#spinner-container').hide();
  }
  
  
  
function getUser(id){
  $.getJSON(url + '/' + id, function(json) {
    let user = json.user;
    $('#name').val(user.name);
    $('#email').val(user.email);
    $('#age').val(user.age);
    $('#comments').val(user.comments);
    return user; 
  });
}
function getUser(id, callback){
    $.getJSON(url + '/' + id, function(json) {
      let user = json.user;
      callback(user);
    });
  }
  

function handleEdit(id) {
    getUser(id, function(user) {
        openModal('edit', user);
    });
}

function getUsers() {

    $('#spinner-container').show();
    $('#resultado').empty(); 

    $.getJSON(url, function (json) {
        let users = json.users;
        let html = `<table>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Age</th><th>Comments</th><th>Actions</th>
          </tr>`;

        users.forEach(user => {
            html += `<tr>
              <td>${user.id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.age}</td>
              <td>${user.comments}</td>
              <td class="accions">
                <button class="btn-edit" onclick="handleEdit(${user.id})" title="Edit">
                <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-delete" onclick="confirmDelete(${user.id})" title="Delete">
                <i class="bi bi-trash"></i>
               </button> 


              </td>
            </tr>`;
        });

        html += '</table>';
        $('#resultado').html(html);

        $('#spinner-container').hide();
    }).fail(function () {
        $('#spinner-container').hide();
        $('#resultado').html('<p style="color:red; text-align:center;">Error al cargar usuarios.</p>');
    });
}

function confirmDelete(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "this action cannot be undone",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F73E7E',
        cancelButtonColor: '#1A2930',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteUser(id);
        }
    });
}

function deleteUser(id) {
    $.ajax({
        url: url + '/' + id,
        type: 'delete',
        success: function () {
            Swal.fire(' User deleted ', '', 'success');
            getUsers();
        }
    });
}

function confirmUpdate(id) {
    const form = document.getElementById("employeeForm");

    if (!form.checkValidity()) {
        form.reportValidity(); 
        return;
    }

    Swal.fire({
        title: '¿would you like to update this user?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#95df3a',
        cancelButtonColor: '#ff5c33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.isConfirmed) {
            updateUser();
            closeModal();
        }
    });
}


function updateUser() {
    var id = $('#userId').val();
    var myuser = {
        name: $('#name').val(),
        email: $('#email').val(),
        age: $('#age').val(),
        comments: $('#comments').val()
    };

    $.ajax({
        url: url + '/' + id,
        type: 'put',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(myuser),
        success: function () {
            Swal.fire('User updated', '', 'success');
            getUsers();
        }
    });
}
