const form = document.querySelector(".add-task-form");
//addedto task
//error
//task deleted
//loading
const successMessageContainer = document.querySelector(".success-message");
const errorMessageContainer = document.querySelector(".error-message");
const loadingMessageContainer = document.querySelector(".loading-message");
const allTasksContainer = document.querySelector(".all-tasks");
const generalMessage = document.querySelector(".general-message");
const wait = async (ms, fn) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, ms);
  });
};
const getAllTasks = async () => {
  if (window.location.pathname !== "/") return;
  try {
    loadingMessageContainer.classList.remove("hidden");
    const res = await fetch("/api/v1/tasks");
    const data = await res.json();
    const { Tasks } = data;
    allTasksContainer.innerHTML = "";
    allTasksContainer.classList.add("hidden");

    Tasks.forEach((task, index) => {
      const html = `
      <li class="row align-items-center mt-2 mb-2">
            <div class="col-1">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexCheckDefault${index}"
                ${task.completed && "checked"}
                data-task-id=${task._id}
                onChange="onCheckBoxClick(event)";
              />
            </div>
            <div class="col-7">
              <label class="form-check-label ${
                task.completed && "text-checked"
              }" for="flexCheckDefault${index}"
                >${task.name}</label
              >
            </div>
            <div class="col-2">
            <button data-task-id=${
              task._id
            } class="btn btn-primary" onClick="onDeleteTask(event)" ;>Delete</button>
          </div>
            <div class="col-2">
              <a href=task.html?${task._id} class="btn btn-primary">Edit</a>
            </div>
          </li>`;
      allTasksContainer.insertAdjacentHTML("beforeend", html);
    });
    if (Tasks.length === 0) {
      generalMessage.classList.remove("hidden");
    }
  } catch (error) {
    errorMessageContainer.classList.remove("hidden");
  } finally {
    setTimeout(() => {
      loadingMessageContainer.classList.add("hidden");
      allTasksContainer.classList.remove("hidden");
    }, 1000);
  }
};

getAllTasks();

const onCheckBoxClick = async (e) => {
  const taskId = e.target.dataset.taskId;
  try {
    const res = await fetch(`/api/v1/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: e.target.checked }),
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    errorMessageContainer.classList.remove("hidden");
  } finally {
    await wait(1000, () => {
      errorMessageContainer.classList.add("hidden");
    });
    getAllTasks();
  }
};

const onDeleteTask = async (e) => {
  const taskId = e.target.dataset.taskId;
  try {
    const res = await fetch(`/api/v1/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    errorMessageContainer.classList.remove("hidden");
  } finally {
    setTimeout(() => {
      errorMessageContainer.classList.add("hidden");
    }, 1000);
    getAllTasks();
  }
};

const onAddTask = async (e) => {
  e.preventDefault();
  const formData = [...new FormData(form)];
  const data = Object.fromEntries(formData);
  let { name } = data;
  name = name.trim();
  if (!name) {
    return;
  }
  try {
    const res = await fetch("/api/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    console.log(msg);
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    form.reset();
  } catch (error) {
    errorMessageContainer.classList.remove("hidden");
  } finally {
    await wait(1000, () => {
      errorMessageContainer.classList.add("hidden");
    });
    getAllTasks();
  }
};
form?.addEventListener("submit", onAddTask);

//for task.html

let editTaskForm = document.querySelector(".edit-task-form");
const toast = document.querySelector(".toast");
const onEditTask = async (e) => {
  e.preventDefault();
  const formData = [...new FormData(editTaskForm)];
  const data = Object.fromEntries(formData);
  let { name, completed } = data;
  if (completed === "on") {
    completed = true;
  } else {
    completed = false;
  }
  try {
    const res = await fetch(
      `/api/v1/tasks/${window.location.search.slice(1)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, completed }),
      }
    );
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    showToast(res.msg || "Task Updated", true);
  } catch (error) {
    showToast(error.message || "Something went wrong!", false);
  } finally {
    await wait(1000, () => {});
    getTask();
  }
};

async function getTask() {
  if (window.location.pathname !== "/task.html") return;
  editTaskForm = document.querySelector(".edit-task-form");
  editTaskForm.innerHTML = "";
  editTaskForm.addEventListener("submit", onEditTask);
  try {
    if (!window.location.search) {
      window.location.href = "/";
    }
    const res = await fetch(`/api/v1/tasks/${window.location.search.slice(1)}`);
    if (!res.ok) {
      throw new Error("Something went wrong!");
    }
    const { task } = await res.json();
    const html = `
    <input
            type="text"
            class="form-control"
            placeholder="${task.name}"
            id="task"
            name="name"
            value="${task.name}"
          />
          <div class="d-flex gap-3 mt-3">
            <label for="flexCheckDefault1">Completed?</label>
            <input
              class="form-check-input"
              type="checkbox"
              id="flexCheckDefault1"
              ${task.completed && "checked"}
              data-task-id=${task._id}
              name="completed" 
            />
          </div>
          <button type="submit" class="btn btn-primary mt-3" id="addTask">
            Edit Task
          </button>
    `;
    editTaskForm.insertAdjacentHTML("beforeend", html);
  } catch (error) {
    console.log(error);
  }
}
getTask();

function showToast(msg, status) {
  let toastElList = [].slice.call(document.querySelectorAll(".toast"));
  let toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl, { autohide: false }); // disable autohide
  });

  // Show the toast
  toastList.forEach((toast) => {
    toast.show();
    console.log(toast);
    document.querySelector(".toast-body").innerHTML = msg;
    if (status) {
      toast._element.classList.add("success");
      toast._element.classList.remove("error");
    } else {
      toast._element.classList.add("error");
      toast._element.classList.remove("success");
    }
    // Hide the toast after 5 seconds
    setTimeout(() => {
      toast.hide();
    }, 5000);
  });
}
