const { getTasks, getTaskById, updateTask, getProjects, addTask } = require('../models/taskModel');

// Get all tasks
const listTasks = (req, res) => {
    const tasks = getTasks();
    const projects = getProjects();
    const username = req.session.user; // Get the logged-in username from the session
    res.render('tasks', { tasks, projects, user: username }); 
};

// Add a new task
const createTask = (req, res) => {
    const { title, projectId, status, dueDate } = req.body;
    const newTask = addTask({ title, projectId: parseInt(projectId), status , dueDate });
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
    const username = req.session.user; // Get the logged-in user's name

    if (!task) {
        return res.status(404).send('Task not found');
    }

    res.render('manage-task', { task, projects });
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

    res.render('dashboard', { projectStatusCounts, username });
};


// Handle Task Updates
const editTask = (req, res) => {
    const { id } = req.params;
    const { title, projectId, status,dueDate } = req.body;

    const success = updateTask(id, { title, projectId: parseInt(projectId), status,dueDate });

    if (!success) {
        return res.status(404).send('Task not found');
    }

    res.redirect('/tasks'); // Redirect back to the task list
};

module.exports = { listTasks, createTask, removeTask, manageTask, editTask, renderDashboard };