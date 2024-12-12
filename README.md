# Simple Todo List Application

A basic todo list application built with Node.js, Express, SQLite, and vanilla JavaScript. Users can create, complete, filter, and delete tasks with data persistence.

## Features

- Create new tasks
- Mark tasks as complete/incomplete
- Delete tasks
- Filter tasks by status (All/Active/Completed)
- Data persistence using SQLite database
- Clean, responsive UI

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v12 or higher)
- npm (comes with Node.js)

## Project Structure

```
todo-app/
├── server/
│   ├── server.js    # Express server setup and API routes
│   └── database.js  # SQLite database configuration
├── public/
│   ├── index.html   # Frontend HTML
│   ├── styles.css   # CSS styling
│   └── script.js    # Frontend JavaScript
└── package.json     # Project dependencies and scripts
```

## Installation

1. Create a new directory for your project and navigate into it:
```bash
mkdir todo-app
cd todo-app
```

2. Initialize a new Node.js project:
```bash
npm init -y
```

3. Install required dependencies:
```bash
npm install express sqlite3 cors
```

4. Create the project structure:
```bash
mkdir server public
```

5. Copy the provided files into their respective directories:
   - `server.js` and `database.js` into the `server` directory
   - `index.html`, `styles.css`, and `script.js` into the `public` directory

## Running the Application

1. Start the server:
```bash
node server/server.js
```

2. Open your web browser and navigate to:
```
http://localhost:3000
```

## How It Works

### Backend (Node.js/Express)

- `database.js`: Sets up SQLite database connection and creates the tasks table
- `server.js`: Implements RESTful API endpoints:
  - GET `/api/tasks`: Retrieve all tasks
  - POST `/api/tasks`: Create a new task
  - PUT `/api/tasks/:id`: Update task completion status
  - DELETE `/api/tasks/:id`: Remove a task

### Frontend (HTML/CSS/JavaScript)

- `index.html`: Basic structure with input field, filter buttons, and task list
- `styles.css`: Responsive styling with a clean, modern design
- `script.js`: Handles:
  - Task management (add/toggle/delete)
  - API communication
  - UI updates
  - Task filtering

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task completion |
| DELETE | `/api/tasks/:id` | Delete task |

## Contributing

This is a simple tutorial project, but feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Future Enhancements

Potential improvements could include:
- User authentication
- Task categories/labels
- Due dates
- Priority levels
- Search functionality
- Task sorting
- Dark mode toggle

## Acknowledgments

This project was created following a tutorial and serves as a basic example of a full-stack JavaScript application using modern web technologies.