const { getTasks, getTaskById, updateTask, getProjects, addTask } = require('../models/taskModel');
const { getUsers } = require('../models/userModel'); // Correct relative path
// Get all tasks
const listTasks = (req, res) => {
    const tasks = getTasks();
    const projects = getProjects();
    const users = getUsers(); // Fetch all users
    const username = req.session.user; // Get the logged-in username from the session

    // Enhance tasks with assignedTo and author details
    const tasksWithDetails = tasks.map(task => ({
        ...task,
        assignedTo: users.find(user => user.username === task.assignedTo)?.username || 'Unassigned',
        author: users.find(user => user.username === task.author)?.username || 'Unknown',
    }));

    res.render('tasks', { tasks: tasksWithDetails, projects,users, user: username });
};

// Add a new task
const createTask = (req, res) => {
    const { title, projectId, status, dueDate } = req.body;
    const newTask = addTask({ title, projectId: parseInt(projectId), status , dueDate, assignedTo: assignedTo || null, author, // Automatically assign the logged-in user as the author 
        });
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


// Render the Manage Task page
const manageTask = (req, res) => {
    const { id } = req.params;
    const task = getTaskById(id);
    const projects = getProjects();
    const users = getUsers(); // Fetch all users
    const username = req.session.user; // Get the logged-in user's name

    if (!task) {
        return res.status(404).send('Task not found');
    }

    res.render('manage-task', { task, projects, users , user: username });
};





// Render Dashboard
const renderDashboard = (req, res) => {
    const tasks = getTasks();
    const projects = getProjects();
    const username = req.session.user; // Get the username from the session

if (!username) {
    return res.redirect('/login'); // Redirect to login if the session is not set
}


    // Group tasks by project and status
    const projectStatusCounts = projects.map(project => {
        const projectTasks = tasks.filter(task => task.projectId === project.id);
        return {
            projectName: project.name,
            Pending: projectTasks.filter(task => task.status === 'Pending').length,
            InProgress: projectTasks.filter(task => task.status === 'In Progress').length,
            Completed: projectTasks.filter(task => task.status === 'Completed').length,
        };
    });

    res.render('dashboard', { projectStatusCounts, user:username });
};


// Handle Task Updates
const editTask = (req, res) => {
    const { id } = req.params;
    const { title, projectId, status, dueDate, assignedTo, author } = req.body;

    // Prepare updated task object
    const updatedTask = {
        title,
        projectId: parseInt(projectId), // Ensure projectId is an integer
        status,
        dueDate: dueDate || null, // Default to null if not provided
        assignedTo: assignedTo || null, // Default to null if not provided
        author: author || null, // Default to null if not provided
        updatedAt: new Date().toISOString(), // Update timestamp
    };

    // Update the task in the data store
    const success = updateTask(id, updatedTask);

    if (!success) {
        return res.status(404).send('Task not found');
    }

    res.redirect('/tasks'); // Redirect back to the task list
};

module.exports = { listTasks, createTask, removeTask, manageTask, editTask, renderDashboard };