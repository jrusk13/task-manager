const { getProjects, addNewProject } = require('../models/projectModel');
const { addTask } = require('../models/taskModel');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Render the Import Page
const renderImportPage = (req, res) => {
    const username = req.session.user;
    if (!username) {
        return res.redirect('/login');
    }
    res.render('import-tasks', { user: username });
};



const handleImport = (req, res) => {
    const { title, status, dueDate, projectName } = req.body; // Field mappings
    const filePath = req.file.path; // Safely access req.file.path

    const projects = getProjects(); // Existing projects
    const results = [];
    const errors = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const mappedTask = {
                title: row[title],
                status: row[status],
                dueDate: row[dueDate],
                projectName: row[projectName],
            };

            // Validate required fields
            if (!mappedTask.title || !mappedTask.status || !mappedTask.dueDate || !mappedTask.projectName) {
                errors.push(`Missing fields: ${JSON.stringify(mappedTask)}`);
                return;
            }

            // Check or create project
            const existingProject = projects.find(
                (project) => project.name.toLowerCase() === mappedTask.projectName.toLowerCase()
            );

            let projectId;
            if (existingProject) {
                projectId = existingProject.id;
            } else {
                const newProject = { name: mappedTask.projectName };
                addNewProject(newProject);
                projectId = newProject.id;
            }

            // Add the task
            const newTask = {
                title: mappedTask.title,
                status: mappedTask.status,
                dueDate: mappedTask.dueDate,
                projectId,
            };

            addTask(newTask);
            results.push(newTask);
        })
        .on('end', () => {
            res.render('import-results', { results, errors, user: req.session.user });
        })
        .on('error', (err) => {
            console.error('Error processing file:', err);
            res.status(500).send('Error processing file.');
        });
};


module.exports = { renderImportPage, handleImport };
