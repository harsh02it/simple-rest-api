const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Sample in-memory data store
let tasks = [];
let nextId = 0;

// Introductory page
app.get("/", (req, res) => {
  res.send(`
        <h1>Welcome to the Simple REST API</h1>
        <p>This application allows you to manage tasks through a simple RESTful API.</p>
        <h2>Task attributes:</h2>
        <ul>
            <li><strong>id</strong> - The unique identifier for the task (Auto assigned)</li>
            <li><strong>title</strong> - The title of the task</li>
            <li><strong>description</strong> - The description of the task</li>
        </ul>
        <h2>Available Endpoints:</h2>
        <ul>
            <li><strong>GET /tasks</strong> - Retrieve all tasks</li>
            <li><strong>POST /tasks</strong> - Create a new task</li>
            <li><strong>PUT /tasks/:id</strong> - Update a task by ID</li>
            <li><strong>DELETE /tasks/:id</strong> - Delete a task by ID</li>
        </ul>
        <h2>Usage Instructions:</h2>
        <p>
            - To retrieve all tasks, send a GET request to <a href="/tasks">/tasks</a>.
        </p>
        <p>
            - To create a new task, send a POST request to <a href="/tasks">/tasks</a> with a JSON body containing the task details.
        </p>
        <p>
            - To update a task, send a PUT request to <a href="/tasks/0">/tasks/:id</a> (replace :id with the task ID) with a JSON body containing the updated task details.
        </p>
        <p>
            - To delete a task, send a DELETE request to <a href="/tasks/0">/tasks/:id</a> (replace :id with the task ID).
        </p>
    `);
});

// CRUD operations
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required." });
  }
  const task = { id: nextId++, title, description };
  tasks.push(task);
  res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const taskIndex = tasks.findIndex((task) => task.id == id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found." });
  }

  tasks[taskIndex] = { id: parseInt(id), title, description };
  res.json(tasks[taskIndex]);
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((task) => task.id == id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found." });
  }
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
