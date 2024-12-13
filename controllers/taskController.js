const { 
    getTasks, 
    getTaskById, 
    updateTask, 
    getProjects, 
    addTask, 
    deleteTask 
} = require('../models/taskModel');
const { getUsers } = require('../models/userModel');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

// Get all tasks
const listTasks = (req, res) => {
    const tasks = getTasks();
    const projects = getProjects();
    const users = getUsers();
    const username = req.session.user;
    const userType = req.session.userType;

    if (!username) {
        return res.redirect('/login');
    }

    const filteredTasks = userType === 'admin' 
        ? tasks 
        : tasks.filter(task => task.assignedTo === username);

    const tasksWithDetails = filteredTasks.map(task => ({
        ...task,
        projectName: projects.find(project => project.id === task.projectId)?.name || 'N/A',
        assignedToName: users.find(user => user.username === task.assignedTo)?.username || 'Unassigned',
        authorName: users.find(user => user.username === task.author)?.username || 'Unknown',
    }));

    res.render('tasks', { tasks: tasksWithDetails, projects, user: username, userType });
};

// Add a new task
const createTask = (req, res) => {
    const { title, projectId, status, dueDate, assignedTo } = req.body;
    const author = req.session.user;

    addTask({ 
        title, 
        projectId: parseInt(projectId), 
        status, 
        dueDate, 
        assignedTo: assignedTo || null, 
        author 
    });

    res.redirect('/tasks');
};

// Render the Add Task page
const renderAddTaskPage = (req, res) => {
    const projects = getProjects();
    const users = getUsers();
    const username = req.session.user;

    if (!username) {
        return res.redirect('/login');
    }

    res.render('add-task', { projects, users, user: username });
};

// Delete a task
const removeTask = (req, res) => {
    const id = req.params.id;
    deleteTask(id);
    res.redirect('/tasks');
};

// Render the Manage Task page
const manageTask = (req, res) => {
    const { id } = req.params;
    const task = getTaskById(id);
    const projects = getProjects();
    const users = getUsers();
    const username = req.session.user;

    if (!task) {
        return res.status(404).send('Task not found');
    }

    res.render('manage-task', { task, projects, users, user: username });
};

// Handle Task Updates
const editTask = (req, res) => {
    const { id } = req.params;
    const { title, projectId, status, dueDate, assignedTo } = req.body;
    const author = req.session.user;

    const updatedTask = {
        title,
        projectId: parseInt(projectId),
        status,
        dueDate: dueDate || null,
        assignedTo: assignedTo || null,
        author: author || null,
        updatedAt: new Date().toISOString(),
    };

    const success = updateTask(id, updatedTask);

    if (!success) {
        return res.status(404).send('Task not found');
    }

    res.redirect('/tasks');
};

// Render the Dashboard
const renderDashboard = (req, res) => {
    const tasks = getTasks();
    const projects = getProjects();
    const username = req.session.user;

    if (!username) {
        return res.redirect('/login');
    }

    const userTasks = tasks.filter(task => task.assignedTo === username);

    const projectStatusCounts = projects.map(project => {
        const projectTasks = userTasks.filter(task => task.projectId === project.id);
        return {
            projectName: project.name,
            Pending: projectTasks.filter(task => task.status === 'Pending').length,
            InProgress: projectTasks.filter(task => task.status === 'In Progress').length,
            Completed: projectTasks.filter(task => task.status === 'Completed').length,
        };
    });

    res.render('dashboard', { projectStatusCounts, user: username });
};

// Render the Reports Page
const renderReportsPage = (req, res) => {
    const projects = getProjects();
    const users = getUsers();
    const username = req.session.user;

    if (!username) {
        return res.redirect('/login');
    }

    res.render('reports', { projects, users, user: username, tasks: [] });
};

// Handle Query for Reports
const handleQuery = (req, res) => {
    const { status, assignedTo, projectId } = req.body;
    const tasks = getTasks();

    // Filter tasks based on query criteria
    const filteredTasks = tasks.filter(task => {
        return (
            (!status || task.status === status) &&
            (!assignedTo || task.assignedTo === assignedTo) &&
            (!projectId || task.projectId === parseInt(projectId))
        );
    });

    const projects = getProjects();
    const users = getUsers();
    const username = req.session.user;

    // Pass query parameters explicitly to the view
    res.render('reports', { 
        projects, 
        users, 
        user: username, 
        tasks: filteredTasks, 
        query: { status, assignedTo, projectId } 
    });
};


// Export Query Results to CSV
const exportQueryResults = (req, res) => {
    const { status, assignedTo, projectId } = req.body;
    const tasks = getTasks();
    const projects = getProjects();

    const filteredTasks = tasks.filter(task => {
        return (
            (!status || task.status === status) &&
            (!assignedTo || task.assignedTo === assignedTo) &&
            (!projectId || task.projectId === parseInt(projectId))
        );
    });

    const csvWriter = createObjectCsvWriter({
        path: path.join(__dirname, '../exports/query_results.csv'),
        header: [
            { id: 'title', title: 'Title' },
            { id: 'status', title: 'Status' },
            { id: 'assignedTo', title: 'Assigned To' },
            { id: 'projectName', title: 'Project' },
            { id: 'dueDate', title: 'Due Date' },
        ],
    });

    const records = filteredTasks.map(task => ({
        title: task.title,
        status: task.status,
        assignedTo: task.assignedTo || 'Unassigned',
        projectName: projects.find(project => project.id === task.projectId)?.name || 'N/A',
        dueDate: task.dueDate || 'No Due Date',
    }));

    csvWriter
        .writeRecords(records)
        .then(() => {
            res.download(path.join(__dirname, '../exports/query_results.csv'), 'query_results.csv', err => {
                if (err) {
                    res.status(500).send('Error exporting the file.');
                }
            });
        })
        .catch(err => {
            console.error('Error writing CSV:', err);
            res.status(500).send('Error generating the CSV file.');
        });
};

// Export all functions
module.exports = { 
    listTasks, 
    createTask, 
    renderAddTaskPage, 
    removeTask, 
    manageTask, 
    editTask, 
    renderDashboard, 
    renderReportsPage, 
    handleQuery, 
    exportQueryResults 
};
