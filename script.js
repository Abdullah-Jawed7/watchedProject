const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const prioritySelect = document.getElementById('priority-select');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const sortTasks = document.getElementById('sort-tasks');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const filter = filterStatus.value;
  const search = searchInput.value.toLowerCase();
  let filtered = tasks.filter(task => {
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (!task.text.toLowerCase().includes(search)) return false;
    return true;
  });

  if (sortTasks.value === 'newest') {
    filtered.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sortTasks.value === 'oldest') {
    filtered.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sortTasks.value === 'priority') {
    const priorities = { high: 3, medium: 2, low: 1 };
    filtered.sort((a, b) => priorities[b.priority] - priorities[a.priority]);
  }

  taskList.innerHTML = '';
  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${index})" />
        <span>${task.text} (${task.priority})</span>
      </div>
      <div class="task-actions">
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (text === '') return alert('Task cannot be empty');

  tasks.push({
    text,
    priority,
    completed: false,
    createdAt: Date.now()
  });
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const newText = prompt('Edit task:', tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

addTaskBtn.addEventListener('click', addTask);
searchInput.addEventListener('input', renderTasks);
filterStatus.addEventListener('change', renderTasks);
sortTasks.addEventListener('change', renderTasks);

renderTasks();
