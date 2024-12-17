const express = require('express');
const { listTasks, createTask, removeTask, manageTask, editTask, renderDashboard,renderAddTaskPage, renderReportsPage ,handleQuery, exportQueryResults } = require('../controllers/taskController');
const router = express.Router();
const multer = require('multer');
const { renderImportPage, handleImport } = require('../controllers/importController');
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

// Route to display the add task page
router.get('/tasks/add', renderAddTaskPage);

router.get('/tasks', listTasks);
router.post('/tasks', createTask);
router.get('/tasks/delete/:id', removeTask); // Add a delete route


// Manage Task: View and Edit
router.get('/tasks/manage/:id', manageTask); // View Task details
router.post('/tasks/manage/:id', editTask); // Edit Task

// Report page route
router.get('/reports', renderReportsPage);

// Query endpoint
router.post('/reports/query', handleQuery);

// Export query results route endpoint
router.post('/reports/export', exportQueryResults);

// Configure multer
const upload = multer({ dest: 'uploads/' });

// Render the Import Tasks page
router.get('/tasks/import', renderImportPage);

// Handle the file upload and import logic
router.post('/tasks/import', upload.single('file'), handleImport);

module.exports = router;

