const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const BlogRoutes = require('./routes/blog');

const Blog = require('./models/blog')

const { checkAUTHENTICATION } = require('./middlewares/authentication');

const app = express();
const PORT = 8000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bloguru')
    .then(() => console.log('Connected to database.'))
    .catch(err => console.error('Database connection error:', err));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 🔹 Apply `checkAUTHENTICATION` Middleware Before Routes
app.use(checkAUTHENTICATION('token'));
app.use(express.static(path.resolve('./public')))
// Home Route
app.get('/',async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render('home', { user: res.locals.user,
        blogs:allBlogs,
     }); // Ensure user is passed
});

// Routes
app.use('/user', userRoutes);
app.use('/blog', BlogRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
