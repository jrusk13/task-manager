const express = require('express');
const router = express.Router();
const { listProjects, addProject, renderAddProjectPage, deleteProject, renderEditProjectPage, editProject } = require('../controllers/projectController');

// List all projects
router.get('/projects', listProjects);

// Render the Add Project page
router.get('/projects/add', renderAddProjectPage);

// Handle Add Project
router.post('/projects/add', addProject);

// Render the Edit Project page
router.get('/projects/edit/:id', renderEditProjectPage);

// Handle Edit Project
router.post('/projects/edit/:id', editProject);

// Handle Delete Project
router.get('/projects/delete/:id', deleteProject);

module.exports = router;
