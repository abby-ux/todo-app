let tasks = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    // Set minimum date to today for the due date input
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dueDateInput').min = today;
});

async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function addTask() {
    const input = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const text = input.value.trim();
    const due_date = dueDateInput.value;
    
    if (text) {
        try {
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, completed: false, due_date }),
            });
            
            const newTask = await response.json();
            tasks.push(newTask);
            renderTasks();
            input.value = '';
            dueDateInput.value = '';
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
}

async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        try {
            await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    completed: !task.completed,
                    due_date: task.due_date 
                }),
            });
            
            task.completed = !task.completed;
            renderTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    }
}

async function updateDueDate(id, newDate) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        try {
            await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    completed: task.completed,
                    due_date: newDate 
                }),
            });
            
            task.due_date = newDate;
            renderTasks();
        } catch (error) {
            console.error('Error updating due date:', error);
        }
    }
}

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

function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
    
    document.querySelectorAll('.filters button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === filter) {
            btn.classList.add('active');
        }
    });
}

function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    return taskDate < today;
}

function formatDate(dateString) {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'overdue') return !task.completed && isOverdue(task.due_date);
        return true;
    });
    
    // Sort tasks by due date
    filteredTasks.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
    });
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''} ${
            !task.completed && isOverdue(task.due_date) ? 'overdue' : ''
        }`;
        
        li.innerHTML = `
            <input type="checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <input type="date" 
                   value="${task.due_date || ''}"
                   onchange="updateDueDate(${task.id}, this.value)"
                   class="due-date-input">
            <span class="due-date ${isOverdue(task.due_date) ? 'overdue' : ''}">
                ${formatDate(task.due_date)}
            </span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        taskList.appendChild(li);
    });
}

// Add keyboard shortcut for adding tasks
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});