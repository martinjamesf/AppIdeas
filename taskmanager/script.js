// Sample hierarchical task data
let tasks = [
  {
    id: '1',
    title: 'Main Task 1',
    children: [
      {
        id: '1-1',
        title: 'Subtask 1-1',
        children: [],
      },
    ],
  },
  {
    id: '2',
    title: 'Main Task 2',
    children: [],
  },
];

// Function to render the task tree
function renderTasks(container, tasks) {
  container.innerHTML = '';
  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    container.appendChild(taskElement);
  });
}

// Function to create a task element
function createTaskElement(task) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task-node';
  taskDiv.textContent = task.title;
  taskDiv.setAttribute('data-id', task.id);

  // Make the task draggable
  draggable({
    element: taskDiv,
    getInitialData: () => ({ id: task.id }),
  });

  // Make the task a drop target
  dropTargetForElements({
    element: taskDiv,
    onDrop: ({ source }) => {
      const sourceId = source.data.id;
      const targetId = task.id;
      if (sourceId !== targetId) {
        moveTask(sourceId, targetId);
        renderTasks(document.getElementById('task-tree'), tasks);
      }
    },
  });

  // Render children if any
  if (task.children && task.children.length > 0) {
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'task-children';
    task.children.forEach(child => {
      const childElement = createTaskElement(child);
      childrenContainer.appendChild(childElement);
    });
    taskDiv.appendChild(childrenContainer);
  }

  return taskDiv;
}

// Function to find and remove a task by ID
function removeTaskById(taskList, id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      return taskList.splice(i, 1)[0];
    } else if (taskList[i].children) {
      const result = removeTaskById(taskList[i].children, id);
      if (result) return result;
    }
  }
  return null;
}

// Function to find a task by ID
function findTaskById(taskList, id) {
  for (const task of taskList) {
    if (task.id === id) {
      return task;
    } else if (task.children) {
      const result = findTaskById(task.children, id);
      if (result) return result;
    }
  }
  return null;
}

// Function to move a task under a new parent
function moveTask(sourceId, targetId) {
  const sourceTask = removeTaskById(tasks, sourceId);
  const targetTask = findTaskById(tasks, targetId);
  if (targetTask && sourceTask) {
    targetTask.children = targetTask.children || [];
    targetTask.children.push(sourceTask);
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderTasks(document.getElementById('task-tree'), tasks);
});
