// DOM Selectors

// Timer
let status = document.querySelector('.status');
let timerDOM = document.querySelector('.timer');
let workTime = document.getElementById('work-time');
let breakTime = document.getElementById('break-time');

const startBtn = document.querySelector('.start');
const resetBtn = document.querySelector('.reset');
const durationBtns = [...document.querySelectorAll('.duration-btn')];
const workPlus = document.querySelector('.work-plus');
const workMinus = document.querySelector('.work-minus');
const breakPlus = document.querySelector('.break-plus');
const breakMinus = document.querySelector('.break-minus');

// Initial Timer Variables
let countdown = 0;
let seconds = 1500;
let workMinutes = 25;
let breakMinutes = 5;
let isBreak = true;
let isPaused = true;
let increment = 5;

// To-Do Items
const todoForm = document.querySelector('.to-do-form');
const todoInput = document.querySelector('.to-do-input');
const addTaskBtn = document.querySelector('.add-task');
const taskList = document.querySelector('.task-list');
const tasks = [...document.querySelectorAll('.task')];
let todoArray = [];

// Create alarm element
const alarm = document.createElement('audio'); // A bell sound will play when the timer reaches 0
alarm.setAttribute("src", "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");

// Duration display matches settings
setDurationDisplay();

// Duration display function
function setDurationDisplay() {
  workTime.innerText = `${workMinutes}`;
  breakTime.innerText = `${breakMinutes}`;
}

// Timer function
function timer() {
  seconds--;

  if (seconds < 0) {
    clearInterval(countdown);
    alarm.currentTime = 0;
    alarm.play();
    // seconds = (isBreak ? breakMinutes : workMinutes) * 60;
    if (isBreak === true) {
      seconds = breakMinutes * 60;
    } else {
      seconds = workMinutes * 60;
    }

    // This is switching the value of isBreak between true and false
    isBreak = !isBreak;
    countdown = setInterval(timer, 1000);
  }

  updateTimerDisplay();
};

// Display countdown
function updateTimerDisplay() {
  let remainingMinutes = Math.floor((seconds / 60) % 60);
  let remainingSeconds = seconds % 60;
  
  timerDOM.innerHTML = `${remainingMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Update start button
function updateStartBtn() {
  if (isPaused && countdown === 0) {
    startBtn.classList.remove('pause');
    startBtn.classList.add('play');
    startBtn.innerText = 'Start';
  } else if (isPaused && countdown !== 0) {
    startBtn.classList.remove('pause');
    startBtn.classList.add('play');
    startBtn.innerText = 'Continue';
  } else {
    startBtn.classList.remove('play');
    startBtn.classList.add('pause');
    startBtn.innerText = 'Pause';
  }
};

// Increment function
function changeIncrement(button) {
  if (button.classList.contains('work-plus') && workMinutes <= 115) {
    workMinutes += increment;
    console.log(workMinutes);
  } else if (button.classList.contains('work-minus') && workMinutes >= 5) {
    workMinutes -= increment;
    console.log(workMinutes);
  } else if (button.classList.contains('break-plus') && breakMinutes < (workMinutes / 2)) {
    breakMinutes += increment;
    console.log(breakMinutes);
  } else if (button.classList.contains('break-minus') && breakMinutes >= 5) {
    breakMinutes -= increment;
    console.log(breakMinutes);
  }

  updateTimerDisplay();
  resetTimer();
  setDurationDisplay();
};

// Reset function
function resetTimer() {
  clearInterval(countdown);
  isPaused = true;
  isBreak = true;
  countdown = 0;
  seconds = workMinutes * 60;
  updateTimerDisplay();
  updateStartBtn();
}

// Add Task
function addTask(item) {
  if (item !== '') {
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };

    todoArray.push(todo);
    addToLocalStorage(todoArray);
    
  }
  todoInput.value = '';
};

// Display Tasks
function displayTasks(tasks) {
  // Clear out everything inside the ul
  taskList.innerHTML = '';

  // Loop through the todoArray
  tasks.forEach(task => {
    const checked = task.completed ? 'completed' : null;

    // Create list element
    const li = document.createElement('li');
    li.setAttribute('class', 'task');
    li.setAttribute('data-key', task.id);

    // If item is completed, add class of completed - haven't added styling for this yet
    if (task.completed === true) {
      li.classList.add('completed');
    }

    li.innerHTML = `
      <input type="checkbox" id="${task.id}" ${checked}>
      <label for="${task.id}">${task.name}</label>
      <button class="delete-btn">&times;</button>
    `;

    // Append list item
    taskList.append(li);
  });
};

// Add to-do list to localStorage
function addToLocalStorage(tasks) {
  // convert the array to string then store it.
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // render them to screen
  displayTasks(todoArray);
}

// Retrieve items from localStorage
function getFromLocalStorage() {
  const reference = localStorage.getItem('tasks');

  if (reference) {
    todoArray = JSON.parse(reference);
    displayTasks(todoArray);
  }
};

// Toggle completed class on list item
function toggleCompleted(id) {
  todoArray.forEach(task => {
    if (task.id == id) {
      // toggle the value
      task.completed = !task.completed;
    }
  });

  addToLocalStorage(todoArray);
}

// Delete task
function deleteTask(id) {
  todoArray = todoArray.filter(function(task) {
    return task.id != id;
  });

  addToLocalStorage(todoArray);
}

// Immediately call getFromLocalStorage()
getFromLocalStorage();

// Timer Event Listeners
startBtn.addEventListener('click', () => {
  clearInterval(countdown);
  isPaused = !isPaused;
  if (!isPaused) {
    countdown = setInterval(timer, 1000);
  }
  updateStartBtn();
});

resetBtn.addEventListener('click', () => resetTimer());

durationBtns.forEach(button => {
  button.addEventListener('click', (e) => {
    changeIncrement(e.currentTarget);
  });
});

// To-Do List Event Listeners
todoForm.addEventListener('submit', e => {
  e.preventDefault();
  addTask(todoInput.value);
});

taskList.addEventListener('click', e => {
  // Check if the event is on the label
  if (event.target.type === 'checkbox') {
    toggleCompleted(event.target.parentElement.getAttribute('data-key'));
  }

    if (event.target.classList.contains('delete-btn')) {
      deleteTask(event.target.parentElement.getAttribute('data-key'));
    }
});


















