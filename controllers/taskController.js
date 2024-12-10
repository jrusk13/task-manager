const { getTasks, getProjects, addTask } = require('../models/taskModel');

// Get all tasks
const listTasks = (req, res) => {
    const tasks = getTasks();
    const projects = getProjects();
    const username = req.session.user; // Get the logged-in username from the session
    res.render('tasks', { tasks, projects, user: username }); 
};

// Add a new task
const createTask = (req, res) => {
    const { title, projectId, status } = req.body;
    const newTask = addTask({ title, projectId: parseInt(projectId), status });
    res.redirect('/tasks'); // Redirect to task list after adding
};

module.exports = { listTasks, createTask };

// Delete a task
const { deleteTask } = require('../models/taskModel');
const removeTask = (req, res) => {
    const id = req.params.id; // GUIDs are strings
    deleteTask(id); // Call the model's delete function
    res.redirect('/tasks'); // Redirect back to the task list
};

module.exports = { listTasks, createTask, removeTask };


