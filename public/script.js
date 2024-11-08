// public/script.js
let tasks = []; // array to store tasks in memory 
let currentFilter = 'all'; // keeps track of the current filter

// Wait for the page to load, then call fetchTasks() to get tasks from the server
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});

// Fetch tasks from the backend
async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}


/**    addTask():
 * 
 * 1) get user input from the DOM
 * 2) trim + check if input is non-empty
 * 3) send a POST request to the server with the task text and completition status 
 * 4) parse the servers response to get the new task data 
 * 5) add the newTask to the tasks array and re-render the UI to display the task list
 * 6) clear the input field for the next task
 * 7) handle any errors (network issues, server errors)
 */

// Add a new task
async function addTask() {
    // input gets an HTML input element that has the ID 'taskInput' from the DOM, 
    // this is where the user types the input into the tasks box
    const input = document.getElementById('taskInput');
    // input.value - contains the actual text of the input
    const text = input.value.trim(); // remove leading/trailing whitespace

    // if the text (user input) has at least on character after trimming:
    if (text) {
        try {
            // await: code will pause until the promise is resolved
            // featch: main JS fucntion for making HTTP requests - call with 2 arguments:
                // URL, points to the servers endpoint for creating new tasks
            const response = await fetch('http://localhost:3000/api/tasks', {
                // set the request method to POST, means data is being sent to the server to create a new resource (task)
                method: 'POST',
                // headers: metadata about the request
                headers: {
                    // data in the body will be in json format
                    'Content-Type': 'application/json',
                },
                // convert the JS object into a json string (bc HTTP requests send raw text)
                body: JSON.stringify({ text, completed: false }), // text-user text, completed-set it to false by default
            });
            // because of the await above, we pause the function until we get the server's response ^^^
            
            // once the server responds, response.json() extracts/parses 
            // waits until json data is fully recieved, and then returns a newTask object,
            // matching the structure as returned by the server
            const newTask = await response.json();
            // add newTask to the tasks array
            tasks.push(newTask);
            // re-render the task list, update the DOM to reflect all tasks
            renderTasks();
            // clear the input box field
            input.value = '';
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
}

/**     toggleTask():
 * 
 * 1) find the task in the tasks array by its id
 * 2) if the task exists, move onto updating it
 * 3) send a PUT request to the server, updating completed to !completed
 * 4) update the task locally in the tasks array
 * 5) re-render the task list in the UI
 * 6) handle any errors
 */

// Toggle task completion status
// parameter is the unique ID of a task
async function toggleTask(id) {
    // loop through the tasks arary and check if eacch task id matches the given id
    // stores the matched task id in task (or undefined if nothing is found)
    const task = tasks.find(t => t.id === id);
    // if we found the task, update it accordingly
    if (task) {
        // async network request 
        try {
            // HTTP reqest to server, send a PUT request to update the task status
                        // endpoints lets server find the specifc task to update
            await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'PUT', // PUT: update the existing resource (the task)
                headers: {
                    'Content-Type': 'application/json', // json data is sent in the request body
                },
                // body: contained the data being sent to the server, as a json string
                // toggles the completed status of the task
                body: JSON.stringify({ completed: !task.completed }),
            });
            // the await above makes sure that the toggle update completed before moving forward ^^^

            // update the tasks local state (local task array)
            task.completed = !task.completed;
            // update the UI to display the new status
            renderTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    }
}

/**     deleteTask():
 * 
 * 1) send a DELETE request to the server specifying the id of the task to be deleted
 * 2) update the local tasks array to remove the delete task
 * 3) re-render the task list in the UI
 * 4) handle any errors
 */

// Delete a task
// takes in the unique id of the task to be deleted
async function deleteTask(id) {
    try {
        // make an async network request to delete the task
        // sends an HTTP DELETE request to the server 
        // server locates the specific task with the URL
        await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: 'DELETE',
            // we dont need any body/headers as we are just deleting data, not sending any data
        });
        // await makes sure the server could delete the data before proceeding
        
        // update the local taks list array
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

/**     filterTasks():
 * 
 *  1) update currentFilter to the filter passed in
 *  2) re-render the task list to only display tasks that match the current filter
 *  3) add the active class to buttons whos text matches the current filter parameter
 */

// Filter tasks
// takes in the filter name ("all", "completed", "pending")
function filterTasks(filter) {
    // set the global currentFilter variable to filter
    currentFilter = filter;
    // re-renders based on the new filter
    renderTasks();
    
    // Update active filter button
    // select all button elements that are children of an element with class 'filters'
        // allows the function to locate all buttons in the filter section
    // loops through each button to update its appearance
    document.querySelectorAll('.filters button').forEach(btn => {
        // reset all the buttons to inactive initially
        btn.classList.remove('active');
        // check if the buttons current text matches the filter value
        if (btn.textContent.toLowerCase() === filter) {
            // add the active class back to the button
            btn.classList.add('active');
        }
    });
}

// Render tasks based on current filter
// operates on the global variables tasks[] and currentFilter
function renderTasks() {
    // get the HTML element with the id of 'taskList'
    // in this case, this is an ul containing the tasks
    const taskList = document.getElementById('taskList');
    // clear any existing content in taskList
    taskList.innerHTML = '';
    
    // filter the tasks based on currentFilter
    // create a new array filteredTasks that only contains the tasks matching currentFilter
    const filteredTasks = tasks.filter(task => {
        // if the filter is 'active', filter for tasks that are not completed
        if (currentFilter === 'active') return !task.completed;
        // if the filter is 'completed', filter for tasks that are completed
        if (currentFilter === 'completed') return task.completed;
        return true;
    });
    
    // iterate over each task and display a new HTML element for each one
    filteredTasks.forEach(task => {
        // create a new <li> (list item) for each task
        const li = document.createElement('li');
        // add the task-item className to every task
        // add the completed class only if completed is true
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // populate each tasks innerHTML content
        li.innerHTML = `
            <input type="checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        // add the new task element to the DOM
        taskList.appendChild(li);
    });
}