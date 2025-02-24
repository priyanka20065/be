const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Function to read tasks from JSON file
const getTasks = () => {
    try {
        const data = fs.readFileSync("tasks.json");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Function to write tasks to JSON file
const saveTasks = (tasks) => {
    fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
};

// Route: Home (View all tasks)
app.get("/tasks", (req, res) => {
    const tasks = getTasks();
    res.render("tasks", { tasks });
});

// Route: View a single task
app.get("/task", (req, res) => {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === parseInt(req.query.id));
    if (task) {
        res.render("task", { task });
    } else {
        res.status(404).send("Task not found");
    }
});

// Route: Add a new task (Form Page)
app.get("/add-task", (req, res) => {
    res.render("addTask");
});

// Route: Add a new task (Processing Form)
app.post("/add-task", (req, res) => {
    const tasks = getTasks();
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.redirect("/tasks");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
