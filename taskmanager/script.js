const { draggable, dropTargetForElements } = window['@atlaskit/pragmatic-drag-and-drop/element/adapter'];

let tasks = [
  {
    id: '1',
    title: 'Task 1',
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
    title: 'Task 2',
    children: [],
  },
];

const taskTreeContainer = document.getElementById('task-tree');

function renderTasks(tasks, container) {
  container.innerHTML = '';
  tasks.forEach((task) => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.textContent = task.title;
    taskElement.dataset.id = task.id;

    // Make the task draggable
    draggable({
      element: taskElement,
      getInitialData: () => ({ id: task.id }),
    });

    // Make the task a drop target
    dropTargetForElements({
      element: taskElement,
      onDrop: ({ source }) => {
        const sourceId = source.data.id;
        const targetId = task.id;
        if (sourceId !== targetId) {
          moveTask(sourceId, targetId);
          renderTasks(tasks, taskTreeContainer);
        }
      },
    });

    container.appendChild(taskElement);

    if (task.children && task.children.length > 0) {
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'task-children';
      renderTasks(task.children, childrenContainer);
      container.appendChild(childrenContainer);
    }
  });
}

function findAndRemoveTask(taskList, taskId) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === taskId) {
      return taskList.splice(i, 1)[0];
    } else if (taskList[i].children) {
      const result = findAndRemoveTask(taskList[i].children, taskId);
      if (result) return result;
    }
  }
  return null;
}

function findTaskById(taskList, taskId) {
  for (let task of taskList) {
    if (task.id === taskId) {
      return task;
    } else if (task.children) {
      const result = findTaskById(task.children, taskId);
      if (result) return result;
    }
  }
  return null;
}

function moveTask(sourceId, targetId) {
  const taskToMove = findAndRemoveTask(tasks, sourceId);
  const targetTask = findTaskById(tasks, targetId);
  if (taskToMove && targetTask) {
    targetTask.children = targetTask.children || [];
    targetTask.children.push(taskToMove);
  }
}

renderTasks(tasks, taskTreeContainer);
