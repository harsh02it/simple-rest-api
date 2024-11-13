const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const { Pool } = require("pg");

// Create a new pool instance
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "taskdb",
  password: "admin",
  port: 5432,
});

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
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required." });
  }
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
