const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Correct import


const tasksFile = path.join(__dirname, '../data/tasks.json');
const projectsFile = path.join(__dirname, '../data/projects.json');

const getTasks = () => JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
const getProjects = () => JSON.parse(fs.readFileSync(projectsFile, 'utf-8'));

// Add a new task
const addTask = (task) => {
    const tasks = getTasks();
    task.id = uuidv4(); // Generate a unique ID for the task
    task.createdAt = new Date().toISOString(); // Set creation timestamp
    task.updatedAt = new Date().toISOString(); // Set updated timestamp
    task.assignedTo = task.assignedTo || null; // Optional: User the task is assigned to
    task.author = task.author || null; // Optional: User who created the task
    tasks.push(task); // Add the task to the array
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2)); // Save updated tasks to the file
    return task; // Return the new task
};

module.exports = { getTasks, addTask }; // Export the addTask function

const deleteTask = (id) => {
    const tasks = getTasks();
    const updatedTasks = tasks.filter((task) => task.id !== id); // Match GUID
    fs.writeFileSync(tasksFile, JSON.stringify(updatedTasks, null, 2));
};


const getTaskById = (id) => {
    const tasks = getTasks();
    return tasks.find((task) => task.id === id);
};

const updateTask = (id, updatedTask) => {
    const tasks = getTasks();
    const index = tasks.findIndex((task) => task.id === id);
    
    if (index === -1) return false; // Task not found

    tasks[index] = {
        ...tasks[index],
        ...updatedTask,
        updatedAt: new Date().toISOString(), // Update the updatedAt field
    };
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
    return true;
};



module.exports = { getTasks, getTaskById, updateTask, addTask, deleteTask, getProjects };