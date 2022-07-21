const taskInput = document.querySelector("#task_input");

taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask(taskInput.value);
    location.reload();
  }
});

// ==========================
// Initially load all tasks from local storage
// ==========================

function displayAllTasks() {
  const taskListElement = document.querySelector(".task_list_items");
  const tasksCounterElement = document.querySelector(".tasks_left_counter");
  const tasks = getAllTasks();
  const df = new DocumentFragment();

  tasks.forEach((item) => df.appendChild(createTaskItem(item)));
  tasksCounterElement.innerText = `${tasks.length} tasks left`;
  taskListElement.appendChild(df);
}

displayAllTasks();

// ==========================
// Create, Get and Set tasks to localStorage
// ==========================

function addTask(task) {
  let allTasks = getAllTasks();
  allTasks.push({ task, status: "active", id: generateUniqueId() });
  setAllTasks(allTasks);
}

function getAllTasks() {
  let tasks = localStorage.getItem("tasks");
  return tasks != null ? JSON.parse(tasks) : [];
}

function setAllTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ==========================
// Create a task list item
// ==========================

function createTaskItem(item) {
  const element = document.createElement("li");
  element.classList.add(item.status);
  element.addEventListener("click", completeTask);

  const div = document.createElement("div");
  div.classList.add("task_list_item");
  div.setAttribute("data-id", item.id);

  const div2 = document.createElement("div");

  const checkBoxImg = createCheckboxImg();

  const paragraph = document.createElement("p");
  paragraph.innerText = item.task;

  const removeImg = createRemoveImg();
  div.appendChild(checkBoxImg);
  div.appendChild(paragraph);
  div2.appendChild(removeImg);
  element.appendChild(div);
  element.appendChild(div2);
  return element;
}

function createRemoveImg() {
  const element = document.createElement("img");
  element.src = "/images/icon-cross.svg";
  element.classList.add("task_removeIcon");
  element.addEventListener("click", (event) => {
    event.stopPropagation();
    const id =
      event.target.parentElement.previousSibling.getAttribute("data-id");
    removeTaskInStorage(id);
    location.reload();
  });

  return element;
}

function removeTaskInStorage(id) {
  let tasks = getAllTasks().filter((item) => item.id !== parseInt(id));
  setAllTasks(tasks);
}

function createCheckboxImg() {
  const element = document.createElement("img");
  element.classList.add("task_checkbox");
  element.src = "/images/icon-check.svg";
  return element;
}

function completeTask(event) {
  let listElement = event.target;

  if (listElement.tagName === "IMG") {
    listElement = listElement.parentElement.parentElement;
  }
  if (listElement.classList.contains("completed_task")) {
    listElement.classList.add("active");
    listElement.classList.remove("completed_task");
  } else {
    listElement.classList.add("completed_task");
    listElement.classList.remove("active");
  }
  const id = listElement
    .querySelector(".task_list_item")
    .getAttribute("data-id");

  markTaskCompletedInStorage(id);
}

function markTaskCompletedInStorage(id) {
  let tasks = getAllTasks();

  tasks.forEach((item) => {
    if (item.id === parseInt(id)) {
      if (item.status === "active") item.status = "completed_task";
      else item.status = "active";
    }
  });

  setAllTasks(tasks);
}

// ==========================
// Generate unique ID
// ==========================

function generateUniqueId() {
  return Math.floor(Math.random() * 10000);
}
