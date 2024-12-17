const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes'); // Import projectRoutes
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// import
app.use(upload.single('file'));

// Redirect root URL to login
app.get('/', (req, res) => {
    res.redirect('/login');
});


// Use routes
app.use(authRoutes); // Auth routes
app.use(taskRoutes); // Task routes
app.use(projectRoutes); //Project routes

app.listen(3500, () => {
    console.log('Server running on http://localhost:3500');
});
