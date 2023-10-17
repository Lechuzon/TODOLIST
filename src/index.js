const form = document.querySelector("form");
const input = document.querySelector("#inputmode");
const tasks = document.querySelector(".tasks");
const body = document.querySelector("body");
const backdropChild = document.querySelector(".backdrop");


async function deleteTask(element) {
  const ok = await destroy(element.dataset.id);

  if (!ok) {
    alert("algo salio mal");
    return;
  }

  // element = button
  element.closest(".card").style.display = "none";
  // element.parentElement.parentElement.parentElement.style.display = "none";
}

async function updateTask(id) {
  const newText = prompt("Ingrese el nuevo texto de la tarea");

  const ok = await put(id, {
    name: newText,
  });

  if (!ok) {
    alert("Hubo un error");
    return;
  }

  const textTask = document.querySelector(`#name-${id}`);
  textTask.textContent = newText;
}

async function endTask(id) {
  const ok = await put(id, { status: 2 });

  if (!ok) {
    alert("Hubo un error");
    return;
  }

  const card = document.querySelector(`#card-${id}`);
  const cardButtons = document.querySelector(`#card-buttons-${id}`);
  card.classList.add("bg-success-rgb");
  cardButtons.remove();
  showOrHideBackDrop(false);
}

function renderTask(task) {
  return `
      <div id="card-${task.id}" class="card mt-3 minicard ${
    task.status === 2 ? `successcard` : ``
  }">
        <div class="card-body">
          <div>
            <h4 id="name-${task.id}">${task.name}</h4>
          </div>
          ${
            task.status !== 2
              ? `
            <div id="card-buttons-${task.id}">
              <button onclick="endTask('${task.id}')" class="btn btn-primary">Completed</button>
              <button onclick="updateTask('${task.id}')" class="btn btn-warning">Edit</button>
              <button onclick="deleteTask(this)" data-id="${task.id}" class="btn btn-danger">Delete</button>
            </div>`
              : ``
          }
        </div>
      </div>`;

}


function orderArray(array) {
  return array.sort((a, b) => a.name.localeCompare(b.name));
}

// crear una funcion que liste (get) las tareas
async function getTasks() {
  const data = await get();
  console.log(data)
  const order = orderArray(data);
  console.log(order);
  order.forEach((task) => {
    tasks.innerHTML += renderTask(task);
  });
}

getTasks();

form.onsubmit = async function (event) {
  // para evitar que la web se recargue
  event.preventDefault();

  if (!input.value) return;

  const tasksList = await get();
  const search = tasksList.find((task) => task.name === input.value);

  if (search) {
    alert("La tarea ya existe");
    return;
  }

  const data = await post({
    name: input.value,
    status: 1,
  });

  input.value = "";
  tasks.innerHTML += renderTask(data);
};



