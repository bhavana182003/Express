const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const users = []; // An array to store user data (in-memory storage for simplicity)

// Set up the Express.js application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'mysecret', // Change this to a secure secret in production
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure the local authentication strategy
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    });
}));

// Serialize and deserialize user information for sessions
passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    const user = users.find(u => u.username === username);
    done(null, user);
});

// Define routes
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if username already exists
    if (users.find(u => u.username === username)) {
        return res.status(400).send('Username already exists');
    }

    // Hash the password and save the new user
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing password');

        const newUser = { username, password: hashedPassword };
        users.push(newUser);
        res.send('User registered successfully');
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false,
}));

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Welcome, ${req.user.username}!`);
    } else {
        res.redirect('/login');
    }
});

app.get('/admin', isAdmin, (req, res) => {
    res.send('Welcome to the admin panel!');
});

// Middleware function to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    } else {
        res.status(403).send('Forbidden');
    }
}

app.listen(3000, () => {
    console.log('Server running on port 3000');
});


