const { getProjects, addNewProject, deleteProjectById, updateProjectById } = require('../models/projectModel');

// List all projects
const listProjects = (req, res) => {
    const projects = getProjects();
    const username = req.session.user;

    if (!username) {
        return res.redirect('/login');
    }

    res.render('projects', { projects, user: username });
};

// Render Add Project Page
const renderAddProjectPage = (req, res) => {
    const username = req.session.user;

    if (!username) {
        return res.redirect('/login');
    }

    res.render('add-project', { user: username });
};

// Add a new project
const addProject = (req, res) => {
    const { name } = req.body;

    addNewProject({ name });
    res.redirect('/projects');
};

// Render Edit Project Page
const renderEditProjectPage = (req, res) => {
    const { id } = req.params;
    const project = getProjects().find(p => p.id === id);
    const username = req.session.user;

    if (!project) {
        return res.status(404).send('Project not found');
    }

    res.render('edit-project', { project, user: username });
};

// Edit a project
const editProject = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    updateProjectById(id, { name });
    res.redirect('/projects');
};

// Delete a project
const deleteProject = (req, res) => {
    const { id } = req.params;

    deleteProjectById(id);
    res.redirect('/projects');
};

module.exports = { listProjects, addProject, renderAddProjectPage, deleteProject, renderEditProjectPage, editProject };
