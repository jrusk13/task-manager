const express = require('express');
const { listTasks, createTask, removeTask } = require('../controllers/taskController');
const router = express.Router();

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next(); // User is authenticated
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
};


router.get('/tasks', listTasks);
router.post('/tasks', createTask);
router.get('/tasks/delete/:id', removeTask); // Add a delete route


module.exports = router;

