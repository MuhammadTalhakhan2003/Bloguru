const path = require('path');
const express = require('express');
const app = express();

const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/bloguru').then((e) => {
console.log('Connected to database.');
})

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.use(express.urlencoded({ extended: false }));

app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}.`);
}
)