// public/script.js
let tasks = [];
let currentFilter = 'all';

// Fetch all tasks when the page loads
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

// Add a new task
async function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text) {
        try {
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, completed: false }),
            });
            
            const newTask = await response.json();
            tasks.push(newTask);
            renderTasks();
            input.value = '';
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
}

// Toggle task completion status
async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        try {
            await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !task.completed }),
            });
            
            task.completed = !task.completed;
            renderTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: 'DELETE',
        });
        
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
    
    // Update active filter button
    document.querySelectorAll('.filters button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === filter) {
            btn.classList.add('active');
        }
    });
}

// Render tasks based on current filter
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        taskList.appendChild(li);
    });
}