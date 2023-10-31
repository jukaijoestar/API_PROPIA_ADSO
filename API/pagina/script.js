document.addEventListener("DOMContentLoaded", function () {
  // Obtén el contenedor de tareas
  const taskListContainer = document.getElementById('task-list-container');
  const apiUrl = 'http://localhost:3000'; // Reemplaza con la URL correcta de tu API local

  // Función para eliminar una tarea
  function deleteTask(taskId) {
    // Realiza una solicitud DELETE para eliminar la tarea
    fetch(`${apiUrl}/Task/${taskId}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Realiza una recarga de la página o actualiza la lista de tareas.
        location.reload();
      })
      .catch(error => console.error('Error al eliminar la tarea:', error));
  }

  // Función para completar o revertir una tarea
  function completeTask(taskId) {
    // Realiza una solicitud GET para obtener la tarea actual
    fetch(`${apiUrl}/Task/${taskId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo obtener la tarea.');
        }
        return response.json();
      })
      .then(task => {
        // Cambia el estado de la tarea entre "Pendiente" y "Terminado"
        task.estado = task.estado === 'Pendiente' ? 'Terminado' : 'Pendiente';

        // Realiza una solicitud PUT para actualizar la tarea en la API
        return fetch(`${apiUrl}/Task/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });
      })
      .then(() => {
        // Realiza una recarga de la página o actualiza la lista de tareas.
        location.reload();
      })
      .catch(error => console.error('Error al completar/pendiente la tarea:', error));
  }

  // Cuando se cargue la página, realiza la solicitud a la API
  fetch(`${apiUrl}/Task`)
    .then(response => {
      if (!response.ok) {
        throw new Error('La solicitud no se pudo completar correctamente.');
      }
      return response.json();
    })
    .then(data => {
      data.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');

        // Define el estado actual de la tarea (Pendiente o Terminado)
        const taskStatus = task.estado === 'Pendiente' ? 'Pendiente' : 'Terminado';

        taskDiv.innerHTML = `
          <div>
            <h2>${task.title}</h2>
            <p>${task.Description}</p>
            <p>Fecha de Vencimiento: ${task['Due Date']}</p>
            <p>Estado: ${taskStatus}</p>
            <p>Materia: ${task.Subject}
            <button class="delete-task" data-task-id="${task.id}">Eliminar</button>
            <button class="complete-task" data-task-id="${task.id}">${task.estado === 'Pendiente' ? 'Todo listo!' : 'Aún no había acabado'}</button>
          </div>
        `;

        // Agrega el div de la tarea al contenedor de tareas
        taskListContainer.appendChild(taskDiv);
      });
    })
    .catch(error => {
      console.error('Ocurrió un error:', error);
    });

  // Agrega un evento clic a los botones "Todo listo!"
  taskListContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('complete-task')) {
      const taskId = e.target.getAttribute('data-task-id');
      completeTask(taskId);
    }
  });

  // Agrega un evento clic a los botones "Eliminar"
  taskListContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-task')) {
      const taskId = e.target.getAttribute('data-task-id');
      deleteTask(taskId);
    }
  });

  // Función para agregar una nueva tarea desde el formulario
  function addTask() {
    const newTaskTitle = document.getElementById('new-task-title').value;
    const newTaskDescription = document.getElementById('new-task-description').value;
    const newTaskDueDate = document.getElementById('new-task-due-date').value;
    const newTaskSubject = document.getElementById('new-task-subject').value;

    // Crea un objeto de tarea con estado inicial "Pendiente"
    const newTask = {
      title: newTaskTitle,
      Description: newTaskDescription,
      'Due Date': newTaskDueDate,
      Subject: newTaskSubject,
      estado: 'Pendiente'
    };

    // Agrega la tarea a la lista "Task"
    fetch(`${apiUrl}/Task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(response => {
        if (response.ok) {
          // Limpia el formulario
          document.getElementById('new-task-title').value = '';
          document.getElementById('new-task-description').value = '';
          document.getElementById('new-task-due-date').value = '';
          document.getElementById('new-task-subject').value = '';

          // Recarga la lista de tareas
          location.reload();
        } else {
          console.error('Error al agregar la nueva tarea.');
        }
      })
      .catch(error => console.error('Error al agregar la tarea:', error));
  }

  // Agrega un evento clic al botón "Agregar Tarea"
  document.getElementById('add-task-button').addEventListener('click', addTask);
});
