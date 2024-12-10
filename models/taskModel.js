const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Correct import


const tasksFile = path.join(__dirname, '../data/tasks.json');
const projectsFile = path.join(__dirname, '../data/projects.json');

const getTasks = () => JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
const getProjects = () => JSON.parse(fs.readFileSync(projectsFile, 'utf-8'));

const addTask = (task) => {
    const tasks = getTasks();
    task.id = uuidv4(); // Generate a GUID for the task ID
    tasks.push(task);
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
    return task;
};

module.exports = { getTasks, getProjects, addTask };

const deleteTask = (id) => {
    const tasks = getTasks();
    const updatedTasks = tasks.filter((task) => task.id !== id); // Match GUID
    fs.writeFileSync(tasksFile, JSON.stringify(updatedTasks, null, 2));
};

module.exports = { getTasks, getProjects, addTask, deleteTask };

