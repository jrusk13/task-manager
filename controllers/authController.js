const { findUser, addUser } = require('../models/userModel');
const bcrypt = require('bcrypt');

// Render login page
const renderLogin = (req, res) => {
    res.render('login', { error: null });
};

// Handle login
const login = async (req, res) => {
    const { username, password } = req.body;
    const user = findUser(username);

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = username; // Store user in session
        res.redirect('/tasks'); // Redirect to tasks
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
};

// Handle logout
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirect to login page
    });
};

// Handle user registration
const register = async (req, res) => {
    const { username, password } = req.body;
    const userExists = findUser(username);

    if (userExists) {
        res.render('login', { error: 'User already exists' });
    } else {
        await addUser(username, password);
        res.redirect('/login'); // Redirect to login after registration
    }
};

module.exports = { renderLogin, login, logout, register };

