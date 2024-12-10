const express = require('express');
const { renderLogin, login, logout, register } = require('../controllers/authController');
const router = express.Router();

// Login routes
router.get('/login', renderLogin);
router.post('/login', login);

// Register routes
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});
router.post('/register', register);

// Logout route
router.get('/logout', logout);

module.exports = router;
