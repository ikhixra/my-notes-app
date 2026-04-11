const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false
}));

//
// ✅ FIXED MongoDB Connection (IMPORTANT)
//
mongoose.connect('mongodb://mongo:27017/notesDB')
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ DB Error:", err));

//
// 📦 SCHEMAS
//

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const noteSchema = new mongoose.Schema({
    text: String,
    userId: String
});

const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);

//
// 🔐 AUTH MIDDLEWARE
//

function isLoggedIn(req, res, next) {
    if (req.session.userId) return next();
    res.redirect('/login');
}

//
// 🔑 AUTH ROUTES
//

// Register Page
app.get('/register', (req, res) => {
    res.render('register');
});

// Register User
app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await User.create({
        username: req.body.username,
        password: hashedPassword
    });

    res.redirect('/login');
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// Login User
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.userId = user._id;
        res.redirect('/');
    } else {
        res.send("❌ Invalid username or password");
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

//
// 📝 NOTES ROUTES (PROTECTED)
//

// READ
app.get('/', isLoggedIn, async (req, res) => {
    const notes = await Note.find({ userId: req.session.userId });
    res.render('index', { notes });
});

// CREATE
app.post('/add', isLoggedIn, async (req, res) => {
    await Note.create({
        text: req.body.note,
        userId: req.session.userId
    });
    res.redirect('/');
});

// DELETE
app.delete('/delete/:id', isLoggedIn, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// EDIT PAGE
app.get('/edit/:id', isLoggedIn, async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('edit', { note });
});

// UPDATE
app.put('/update/:id', isLoggedIn, async (req, res) => {
    await Note.findByIdAndUpdate(req.params.id, {
        text: req.body.note
    });
    res.redirect('/');
});

//
// 🚀 SERVER
//

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});