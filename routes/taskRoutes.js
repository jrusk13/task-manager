const express = require('express');
const { listTasks, createTask, removeTask, manageTask, editTask, renderDashboard } = require('../controllers/taskController');
const router = express.Router();

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next(); // User is authenticated
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
};


// Dashboard route
router.get('/dashboard', renderDashboard);

router.get('/tasks', listTasks);
router.post('/tasks', createTask);
router.get('/tasks/delete/:id', removeTask); // Add a delete route


// Manage Task: View and Edit
router.get('/tasks/manage/:id', manageTask); // View Task details
router.post('/tasks/manage/:id', editTask); // Edit Task


module.exports = router;

